import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name="", email, password, province="Gauteng" } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false, error:"email+password required" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ ok:false, error:"email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email: email.toLowerCase(), password: hash, province });

  return res.json({ ok:true, token: signToken(user._id), user: { id:user._id, name:user.name, email:user.email, province:user.province, avatarUrl:user.avatarUrl, isAdmin:user.isAdmin } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false, error:"email+password required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ ok:false, error:"invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ ok:false, error:"invalid credentials" });

  return res.json({ ok:true, token: signToken(user._id), user: { id:user._id, name:user.name, email:user.email, province:user.province, avatarUrl:user.avatarUrl, isAdmin:user.isAdmin } });
});

export default router;