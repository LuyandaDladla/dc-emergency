import AnalyticsEvent from "../models/AnalyticsEvent.js";

export async function trackEvent(req, res) {
  const userId = req.user ? req.user._id : null;
  const { event, meta } = req.body || {};
  if (!event) return res.status(400).json({ message: "Missing event" });

  await AnalyticsEvent.create({ userId, event, meta: meta || {} });
  res.json({ ok: true });
}

export async function adminStats(req, res) {
  const total = await AnalyticsEvent.countDocuments();
  const last = await AnalyticsEvent.find().sort({ createdAt: -1 }).limit(25);
  res.json({ total, last });
}