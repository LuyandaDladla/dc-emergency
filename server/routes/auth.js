import express from "express";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/token.js";

const router = express.Router();

// TEMP in-memory users (replace with Mongo User model later)
const users = new Map(); // email -> { id, email, passHash, name, isAdmin, photoUrl }

router.post("/register", async (req, res) => {
  const { email, password, name = "" } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false, error:"email and password required" });
  if (users.has(email)) return res.status(409).json({ ok:false, error:"user exists" });

  const passHash = await bcrypt.hash(password, 10);
  const u = { id: "u_" + Date.now(), email, passHash, name, isAdmin:false, photoUrl:"" };
  users.set(email, u);

  const token = signToken({ id: u.id, email: u.email, isAdmin: u.isAdmin });
  res.json({ ok:true, token, user: { id:u.id, email:u.email, name:u.name, isAdmin:u.isAdmin, photoUrl:u.photoUrl } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok:false, error:"email and password required" });

  const u = users.get(email);
  if (!u) return res.status(401).json({ ok:false, error:"invalid credentials" });

  const ok = await bcrypt.compare(password, u.passHash);
  if (!ok) return res.status(401).json({ ok:false, error:"invalid credentials" });

  const token = signToken({ id: u.id, email: u.email, isAdmin: u.isAdmin });
  res.json({ ok:true, token, user: { id:u.id, email:u.email, name:u.name, isAdmin:u.isAdmin, photoUrl:u.photoUrl } });
});

export default router;