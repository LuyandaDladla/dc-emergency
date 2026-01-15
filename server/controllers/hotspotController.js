import Hotspot from "../models/Hotspot.js";

export async function listHotspots(req, res) {
  const province = req.query.province;
  const q = { active: true };
  if (province) q.province = province;
  const items = await Hotspot.find(q).sort({ severity: -1, createdAt: -1 }).limit(200);
  res.json({ items });
}

export async function listVerifiedStories(req, res) {
  // return a small set for "stories bar"
  const items = await Hotspot.find({ active: true, verified: true })
    .sort({ severity: -1, createdAt: -1 })
    .limit(12);

  const stories = items.map(h => ({
    type: "hotspot",
    id: String(h._id),
    title: h.title,
    province: h.province,
    severity: h.severity
  }));

  res.json({ stories });
}

// Admin CRUD
export async function adminList(req, res) {
  const items = await Hotspot.find().sort({ createdAt: -1 }).limit(500);
  res.json({ items });
}

export async function adminCreate(req, res) {
  const b = req.body || {};
  const doc = await Hotspot.create({
    title: b.title,
    province: b.province,
    severity: b.severity || "medium",
    centerLat: Number(b.centerLat),
    centerLng: Number(b.centerLng),
    radiusMeters: Number(b.radiusMeters || 500),
    verified: b.verified !== false,
    notes: b.notes || "",
    active: b.active !== false
  });
  res.status(201).json({ doc });
}

export async function adminUpdate(req, res) {
  const id = req.params.id;
  const b = req.body || {};
  const doc = await Hotspot.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  const fields = ["title","province","severity","centerLat","centerLng","radiusMeters","verified","notes","active"];
  for (const f of fields) if (b[f] !== undefined) doc[f] = b[f];
  await doc.save();

  res.json({ doc });
}

export async function adminDelete(req, res) {
  const id = req.params.id;
  await Hotspot.findByIdAndDelete(id);
  res.json({ ok: true });
}