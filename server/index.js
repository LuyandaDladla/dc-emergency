const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  credentials: true
}));

app.get("/health", (req, res) => res.json({ ok: true }));

const users = new Map();
users.set("demo@dcacademy.app", {
  id: "demo-user",
  email: "demo@dcacademy.app",
  name: "Demo User",
  password: "Demo@12345"
});

app.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body || {};
  const e = String(email || "").trim().toLowerCase();
  const p = String(password || "");
  const n = String(name || "").trim() || "User";

  if (!e || !p) return res.status(400).json({ error: "Email and password required" });
  if (users.has(e)) return res.status(409).json({ error: "User already exists" });

  const id = "u_" + Math.random().toString(36).slice(2, 10);
  users.set(e, { id, email: e, name: n, password: p });
  return res.json({ user: { id, email: e, name: n } });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const e = String(email || "").trim().toLowerCase();
  const p = String(password || "");

  const u = users.get(e);
  if (!u || u.password !== p) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ user: { id: u.id, email: u.email, name: u.name } });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("API listening on http://localhost:" + PORT));