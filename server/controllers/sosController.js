import SosEvent from "../models/SosEvent.js";
import Province from "../models/Province.js";
import { sendDCAcademyAlert } from "../services/emailService.js";

export async function triggerSOS(req, res) {
  const { province, latitude, longitude, message } = req.body || {};
  const finalProvince = province || (req.user && req.user.province) || "";

  const doc = await SosEvent.create({
    userId: req.user ? req.user._id : null,
    province: finalProvince,
    latitude,
    longitude,
    message: message || "SOS"
  });

  const contacts = (req.user && req.user.emergencyContacts) ? req.user.emergencyContacts : [];
  const dcEmail = process.env.DC_ACADEMY_ALERT_EMAIL;

  let provinceInfo = null;
  if (finalProvince) provinceInfo = await Province.findOne({ name: finalProvince });

  const emergencyNumbers = provinceInfo ? provinceInfo.emergencyNumbers : {
    police: "10111",
    ambulance: "10177",
    gbvHelpline: "0800 428 428",
    childline: "116",
    additional: []
  };

  const contactsText = contacts.length
    ? contacts.map(function (c) {
        return (c.name || "Contact") + ":" + (c.phone || c.email || "");
      }).join(" | ")
    : "none";

  const textLines = [
    "DC EMERGENCY SOS ALERT",
    "",
    "User: " + ((req.user && req.user.email) ? req.user.email : "unknown"),
    "Province: " + (finalProvince || "unknown"),
    "Message: " + (doc.message || ""),
    "Location: " + (latitude ? latitude : "n/a") + ", " + (longitude ? longitude : "n/a"),
    "Contacts: " + contactsText,
    "",
    "Emergency Numbers (SA):",
    "Police: " + emergencyNumbers.police,
    "Ambulance: " + emergencyNumbers.ambulance,
    "GBV Helpline: " + emergencyNumbers.gbvHelpline,
    "Childline: " + emergencyNumbers.childline,
    "",
    "SOS ID: " + String(doc._id)
  ];

  let emailResult = { skipped: true, reason: "not attempted" };
  try {
    emailResult = await sendDCAcademyAlert({
      to: dcEmail,
      subject: "SOS ALERT - " + (finalProvince || "SA"),
      text: textLines.join("\n")
    });
  } catch (e) {
    emailResult = { sent: false, error: e.message };
  }

  res.status(201).json({ ok: true, sosId: doc._id, emergencyNumbers, emailResult });
}