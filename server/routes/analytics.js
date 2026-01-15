import express from "express";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", async (req, res) => {
  const { event, props={} } = req.body || {};
  if (!event) return res.status(400).json({ ok:false, error:"event required" });

  // Optional auth: if token exists, attach userId
  let userId = null;
  try {
    // no-op here; client can send userId via authenticated endpoint later
  } catch (e) {}

  const saved = await AnalyticsEvent.create({ userId, event, props });
  res.json({ ok:true, id: saved._id });
});

export default router;