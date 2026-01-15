import express from "express";
import Risk from "../models/Risk.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, async (req, res) => {
  const answers = req.body || {};
  const score = Number(answers.score || 0);
  const item = await Risk.create({ userId: req.user._id, score, answers });
  res.json({ ok:true, saved:item });
});

export default router;