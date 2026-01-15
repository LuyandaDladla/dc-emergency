import TherapistMessage from "../models/TherapistMessage.js";

function safeReply(userText) {
  const t = (userText || "").toLowerCase();

  // Crisis-ish detection (very basic)
  const crisis = t.includes("suicide") || t.includes("kill myself") || t.includes("i want to die") || t.includes("self harm");

  if (crisis) {
    return "I am really sorry you are feeling this way. If you are in immediate danger, please press the SOS button now or contact someone you trust right away. You can also call emergency services (10111) or ambulance (10177). If you want, tell me where you are and whether you are safe right now.";
  }

  // Supportive, non-medical
  return "Thank you for sharing that. I am here with you. Can you tell me what happened today, and what you need most right now: safety, calm, advice, or someone to listen?";
}

export async function sendMessage(req, res) {
  const text = (req.body && req.body.text) ? String(req.body.text) : "";
  if (!text.trim()) return res.status(400).json({ message: "Missing text" });

  await TherapistMessage.create({ userId: req.user._id, role: "user", text });

  const reply = safeReply(text);
  await TherapistMessage.create({ userId: req.user._id, role: "assistant", text: reply });

  res.json({ reply });
}

export async function history(req, res) {
  const msgs = await TherapistMessage.find({ userId: req.user._id }).sort({ createdAt: 1 }).limit(200);
  res.json({ msgs });
}

export async function adminCounts(req, res) {
  const total = await TherapistMessage.countDocuments();
  res.json({ total });
}