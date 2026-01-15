import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json({ ok:true, user: req.user });
});

router.put("/me", protect, async (req, res) => {
  const patch = req.body || {};
  const allowed = ["name","province","emergencyContacts","avatarUrl"];
  const update = {};
  for (const k of allowed) if (patch[k] !== undefined) update[k] = patch[k];

  const user = await User.findByIdAndUpdate(req.user._id, update, { new:true }).select("-password");
  res.json({ ok:true, user });
});

// simple avatar set (URL-based). Later replace with Cloudinary upload.
router.post("/avatar", protect, async (req, res) => {
  const { avatarUrl } = req.body || {};
  if (!avatarUrl) return res.status(400).json({ ok:false, error:"avatarUrl required" });
  const user = await User.findByIdAndUpdate(req.user._id, { avatarUrl }, { new:true }).select("-password");
  res.json({ ok:true, user });
});

export default router;