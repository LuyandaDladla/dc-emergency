import SosEvent from "../models/SosEvent.js";
import User from "../models/User.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";

export async function stats(req, res) {
  const users = await User.countDocuments();
  const sosCount = await SosEvent.countDocuments();
  const analyticsCount = await AnalyticsEvent.countDocuments();
  res.json({ users, sosCount, analyticsCount });
}

export async function sosFeed(req, res) {
  const items = await SosEvent.find().sort({ createdAt: -1 }).limit(100);
  res.json({ items });
}
