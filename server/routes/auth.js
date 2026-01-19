import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, isAdmin: !!user.isAdmin },
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "7d" }
  );
}

function isBcryptHash(pw = "") {
  // bcrypt hashes start with $2a$, $2b$, or $2y$
  return typeof pw === "string" && /^\$2[aby]\$/.test(pw);
}

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    // Backward compatible password check
    let ok = false;

    if (typeof user.matchPassword === "function") {
      ok = await user.matchPassword(password);
    } else if (isBcryptHash(user.password)) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      // legacy plain-text password (bad, but we support + auto-fix)
      ok = user.password === password;
      if (ok) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
      }
    }

    if (!ok) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const token = signToken(user);
    return res.json({ ok: true, token });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
});

export default router;
