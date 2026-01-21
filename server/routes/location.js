// server/routes/location.js
import express from "express";
import { resolveProvince } from "../utils/provinceFromLatLng.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/location/resolve
 * body: { lat, lng, accuracy }
 * returns: { ok, province, label }
 */
router.post("/resolve", async (req, res) => {
  try {
    const { lat, lng } = req.body || {};
    const out = resolveProvince(lat, lng);
    return res.json({ ok: true, ...out });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

/**
 * POST /api/location/heartbeat  (optional, protected)
 * body: { lat, lng, accuracy }
 */
router.post("/heartbeat", auth, async (req, res) => {
  try {
    const { lat, lng, accuracy } = req.body || {};
    const out = resolveProvince(lat, lng);

    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        lastKnownLocation: {
          lat: Number(lat),
          lng: Number(lng),
          accuracy: Number(accuracy || 0),
          province: out.province,
          at: new Date(),
        },
      },
    });

    return res.json({ ok: true, ...out });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

export default router;
