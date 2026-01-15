import Province from "../models/Province.js";

export async function listProvinces(req, res) {
  const items = await Province.find().sort({ name: 1 });
  res.json({ items });
}

export async function getProvince(req, res) {
  const name = req.params.name;
  const p = await Province.findOne({ name });
  if (!p) return res.status(404).json({ message: "Province not found" });
  res.json(p);
}