import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body || {};
        if (!email || !password) return res.status(400).json({ ok: false, error: "email and password required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ ok: false, error: "User already exists" });

        const user = await User.create({ email, password, name: name || email.split("@")[0] });

        const token = jwt.sign(
            { id: user._id.toString(), email: user.email, isAdmin: !!user.isAdmin },
            process.env.JWT_SECRET || "dev_secret_change_me",
            { expiresIn: "7d" }
        );

        return res.json({ ok: true, token });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e?.message || "Server error" });
    }
});




 
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ ok: false, error: "User not found" });
    return res.json({ ok: true, user });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});





export default router;