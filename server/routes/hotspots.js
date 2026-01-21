// server/routes/hotspots.js
import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";

const router = express.Router();

const SosEvent = mongoose.model("SosEvent"); // from sos.js model registration

/**
 * GET /api/hotspots?province=Gauteng&days=30
 * MVP: counts SOS events by province over a window
 */
router.get("/", auth, async (req, res) => {
    try {
        const province = (req.query.province || "").toString();
        const days = Math.min(90, Math.max(1, Number(req.query.days || 30)));

        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const match = { createdAt: { $gte: since } };
        if (province) match.province = province;

        const agg = await SosEvent.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$province",
                    count: { $sum: 1 },
                    last: { $max: "$createdAt" },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ]);

        return res.json({ ok: true, days, items: agg.map((x) => ({ province: x._id, count: x.count, last: x.last })) });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});

export default router;
