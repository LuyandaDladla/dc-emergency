import express from "express";
import Hotspot from "../models/Hotspot.js";

const router = express.Router();

// GET /api/hotspots
router.get("/", async (req, res) => {
    try {
        const items = await Hotspot.find({}).sort({ updatedAt: -1 }).limit(200);
        res.json({ ok: true, hotspots: items });
    } catch (e) {
        res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});

// POST /api/hotspots/seed (demo seed)
router.post("/seed", async (req, res) => {
    try {
        const seed = [
            { name: "CBD (Johannesburg)", province: "Gauteng", lat: -26.2041, lng: 28.0473, radiusMeters: 700, riskLevel: "high" },
            { name: "Durban Central", province: "KwaZulu-Natal", lat: -29.8587, lng: 31.0218, radiusMeters: 600, riskLevel: "high" },
            { name: "Cape Town CBD", province: "Western Cape", lat: -33.9249, lng: 18.4241, radiusMeters: 650, riskLevel: "medium" },
        ];
        await Hotspot.deleteMany({});
        const created = await Hotspot.insertMany(seed);
        res.json({ ok: true, count: created.length });
    } catch (e) {
        res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});

export default router;
