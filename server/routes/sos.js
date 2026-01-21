// server/routes/sos.js
import express from "express";
import auth from "../middleware/auth.js";
import mongoose from "mongoose";
import { resolveProvince } from "../utils/provinceFromLatLng.js";

const router = express.Router();

const SosEvent = mongoose.model(
    "SosEvent",
    new mongoose.Schema(
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            lat: Number,
            lng: Number,
            accuracy: Number,
            province: { type: String, default: "Unknown" },
            status: { type: String, default: "created" }, // created | dispatched | resolved
            note: { type: String, default: "" },
        },
        { timestamps: true }
    )
);

/**
 * POST /api/sos/trigger
 * body: { lat, lng, accuracy, note }
 */
router.post("/trigger", auth, async (req, res) => {
    try {
        const { lat, lng, accuracy, note } = req.body || {};
        const prov = resolveProvince(lat, lng);

        const ev = await SosEvent.create({
            userId: req.user.id,
            lat: Number(lat),
            lng: Number(lng),
            accuracy: Number(accuracy || 0),
            province: prov.province,
            status: "created",
            note: String(note || ""),
        });

        return res.json({ ok: true, id: ev._id.toString(), province: prov.province, status: ev.status });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});

/**
 * GET /api/sos/mine
 */
router.get("/mine", auth, async (req, res) => {
    try {
        const items = await SosEvent.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
        return res.json({ ok: true, items });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});

export default router;
