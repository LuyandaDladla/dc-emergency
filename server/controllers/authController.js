import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name: name || "User", email, passwordHash, isAdmin: false });

  const token = signToken({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  res.json({ token });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  res.json({ token, isAdmin: user.isAdmin });
}

export async function me(req, res) {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    isAdmin: req.user.isAdmin,
    province: req.user.province,
    language: req.user.language,
    emergencyContacts: req.user.emergencyContacts
  });
}

export async function addContact(req, res) {
  const { name, phone, email } = req.body || {};
  if (!name || (!phone && !email)) return res.status(400).json({ message: "Name and phone or email required" });

  req.user.emergencyContacts.push({ name, phone: phone || "", email: email || "" });
  await req.user.save();
  res.json({ emergencyContacts: req.user.emergencyContacts });
}
