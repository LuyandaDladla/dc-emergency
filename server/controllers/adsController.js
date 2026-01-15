import Ad from "../models/Ad.js";

export async function listAds(req, res) {
  const ads = await Ad.find({ active: true }).sort({ createdAt: -1 }).limit(20);
  res.json({ ads });
}