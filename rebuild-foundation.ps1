$ErrorActionPreference = "Stop"

function WriteFile($path, $content) {
  $dir = Split-Path -Parent $path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-Host "DC Emergency Web - Full Clean Rebuild (A)" -ForegroundColor Cyan
Write-Host "This will DELETE and recreate client/ and server/ folders." -ForegroundColor Yellow

# ----- SAFETY: must be in project root -----
$root = Get-Location
Write-Host ("Project root: " + $root) -ForegroundColor Gray

# ----- DELETE old folders -----
if (Test-Path ".\client") { Remove-Item -Recurse -Force ".\client" }
if (Test-Path ".\server") { Remove-Item -Recurse -Force ".\server" }

# ----- CREATE folder structure -----
$dirs = @(
  "client\src\components",
  "client\src\pages",
  "client\src\services",
  "client\src\styles",
  "server\config",
  "server\controllers",
  "server\middleware",
  "server\models",
  "server\routes",
  "server\services",
  "server\utils"
)
foreach ($d in $dirs) { New-Item -ItemType Directory -Force -Path $d | Out-Null }

# =========================
# CLIENT (Vite + React)
# =========================

WriteFile "client\package.json" @"
{
  "name": "dc-emergency-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^5.4.11"
  }
}
"@

WriteFile "client\vite.config.js" @"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000"
    }
  }
});
"@

WriteFile "client\index.html" @"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DC Emergency</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
"@

WriteFile "client\src\main.jsx" @"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/app.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
"@

WriteFile "client\src\styles\app.css" @"
:root { font-family: Arial, sans-serif; }
body { margin: 0; background: #0b0b0b; color: #f2f2f2; }
a { color: inherit; text-decoration: none; }
.container { max-width: 980px; margin: 0 auto; padding: 16px; }
.nav { position: fixed; bottom: 0; left: 0; right: 0; background: #111; border-top: 1px solid #222; display: flex; justify-content: space-around; padding: 10px 0; }
.card { background: #121212; border: 1px solid #222; border-radius: 14px; padding: 14px; margin-bottom: 12px; }
.btn { padding: 12px 14px; border-radius: 12px; border: 1px solid #333; background: #1a1a1a; color: #fff; cursor: pointer; }
.btn-danger { background: #b00020; border-color: #b00020; }
.input { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #333; background: #0f0f0f; color: #fff; margin-bottom: 10px; }
.row { display: flex; gap: 10px; flex-wrap: wrap; }
.small { font-size: 12px; color: #aaa; }
.badge { display:inline-block; padding: 4px 8px; border: 1px solid #333; border-radius: 999px; font-size: 12px; color:#ddd; }
"@

WriteFile "client\src\services\api.js" @"
import axios from "axios";

export const api = axios.create({
  baseURL: "/api"
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = "Bearer " + token;
  else delete api.defaults.headers.common["Authorization"];
}
"@

WriteFile "client\src\App.jsx" @"
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Community from "./pages/Community.jsx";
import Therapist from "./pages/Therapist.jsx";
import SOS from "./pages/SOS.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <header className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>DC Emergency</div>
            <div className="small">Safety. Wellness. Community.</div>
          </div>
          <div className="badge">SA</div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/community" element={<Community />} />
        <Route path="/therapist" element={<Therapist />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/community">Community</Link>
        <Link to="/therapist">Therapist</Link>
        <Link to="/sos">SOS</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}
"@

WriteFile "client\src\pages\Home.jsx" @"
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.get("/health").then(r => setHealth(r.data)).catch(() => setHealth({ status: "Backend not reachable" }));
  }, []);

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>System status</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700 }}>Instagram-like feed direction</div>
        <div className="small">
          This scaffold uses a feed + bottom nav pattern. Next phase: real feed cards, alerts, stories-style UI.
        </div>
      </div>
    </div>
  );
}
"@

WriteFile "client\src\pages\Community.jsx" @"
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [scope, setScope] = useState("national");
  const [province, setProvince] = useState("Gauteng");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const load = async () => {
    const params = { scope, province };
    const r = await api.get("/posts", { params });
    setPosts(r.data.posts || []);
  };

  useEffect(() => { load(); }, [scope, province]);

  const create = async () => {
    await api.post("/posts", { scope, province, title, content });
    setTitle(""); setContent("");
    await load();
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Community feed</div>

        <div className="row">
          <button className="btn" onClick={() => setScope("national")}>National</button>
          <button className="btn" onClick={() => setScope("province")}>Province</button>
        </div>

        {scope === "province" && (
          <div style={{ marginTop: 10 }}>
            <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
              <option>Eastern Cape</option>
              <option>Free State</option>
              <option>Gauteng</option>
              <option>KwaZulu-Natal</option>
              <option>Limpopo</option>
              <option>Mpumalanga</option>
              <option>North West</option>
              <option>Northern Cape</option>
              <option>Western Cape</option>
            </select>
          </div>
        )}

        <div style={{ marginTop: 12, fontWeight: 700 }}>Create post (requires login token later)</div>
        <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input" placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows="4" />
        <button className="btn" onClick={create}>Post</button>
        <div className="small">Moderation and admin verification is scaffolded in backend.</div>
      </div>

      {posts.map(p => (
        <div className="card" key={p._id}>
          <div style={{ fontWeight: 700 }}>{p.title}</div>
          <div className="small">{p.scope} {p.province ? ("- " + p.province) : ""}</div>
          <div style={{ marginTop: 8 }}>{p.content}</div>
        </div>
      ))}
    </div>
  );
}
"@

WriteFile "client\src\pages\Therapist.jsx" @"
import { useState } from "react";
import { api } from "../services/api.js";

export default function Therapist() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  const send = async () => {
    const userMsg = { role: "user", text: msg };
    setChat(c => [...c, userMsg]);
    setMsg("");

    const r = await api.post("/ai/therapy", { message: userMsg.text });
    setChat(c => [...c, { role: "assistant", text: r.data.reply }]);
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>AI Therapist (safe scaffold)</div>
        <div className="small">
          This is a stub endpoint. Next phase: connect real model + crisis routing and safety policies.
        </div>
      </div>

      {chat.map((m, i) => (
        <div className="card" key={i}>
          <div className="small">{m.role}</div>
          <div>{m.text}</div>
        </div>
      ))}

      <div className="card">
        <textarea className="input" rows="3" placeholder="Type here..." value={msg} onChange={(e) => setMsg(e.target.value)} />
        <button className="btn" onClick={send} disabled={!msg.trim()}>Send</button>
      </div>
    </div>
  );
}
"@

WriteFile "client\src\pages\SOS.jsx" @"
import { useState } from "react";
import { api } from "../services/api.js";

export default function SOS() {
  const [status, setStatus] = useState("Ready");
  const [province, setProvince] = useState("Gauteng");

  const trigger = () => {
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const payload = {
        province,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        message: "Emergency SOS"
      };
      setStatus("Sending...");
      await api.post("/sos", payload);
      setStatus("Sent");
    }, async () => {
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message: "Emergency SOS (no GPS)" });
      setStatus("Sent");
    });
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>SOS</div>
        <div className="small">
          This calls backend /api/sos. Contacts + email/SMS integrations are scaffolded server-side.
        </div>
      </div>

      <div className="card">
        <select className="input" value={province} onChange={(e) => setProvince(e.target.value)}>
          <option>Eastern Cape</option>
          <option>Free State</option>
          <option>Gauteng</option>
          <option>KwaZulu-Natal</option>
          <option>Limpopo</option>
          <option>Mpumalanga</option>
          <option>North West</option>
          <option>Northern Cape</option>
          <option>Western Cape</option>
        </select>

        <button className="btn btn-danger" onClick={trigger} style={{ width: "100%", fontSize: 18 }}>
          Trigger SOS
        </button>
        <div className="small">Status: {status}</div>
      </div>
    </div>
  );
}
"@

WriteFile "client\src\pages\Profile.jsx" @"
import { useState } from "react";
import { api, setAuthToken } from "../services/api.js";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [cname, setCname] = useState("");
  const [cphone, setCphone] = useState("");
  const [contacts, setContacts] = useState([]);

  const register = async () => {
    const r = await api.post("/auth/register", { name: "User", email, password });
    setAuthToken(r.data.token);
    localStorage.setItem("token", r.data.token);
    alert("Registered and logged in");
  };

  const login = async () => {
    const r = await api.post("/auth/login", { email, password });
    setAuthToken(r.data.token);
    localStorage.setItem("token", r.data.token);
    alert("Logged in");
  };

  const loadContacts = async () => {
    const r = await api.get("/auth/me");
    setContacts(r.data.emergencyContacts || []);
  };

  const addContact = async () => {
    await api.post("/auth/contacts", { name: cname, phone: cphone });
    setCname(""); setCphone("");
    await loadContacts();
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>Account</div>
        <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="row">
          <button className="btn" onClick={register}>Register</button>
          <button className="btn" onClick={login}>Login</button>
          <button className="btn" onClick={loadContacts}>Load Contacts</button>
        </div>
        <div className="small">Token stored in localStorage as 'token'.</div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 700 }}>Emergency contacts</div>
        <input className="input" placeholder="Name" value={cname} onChange={(e) => setCname(e.target.value)} />
        <input className="input" placeholder="Phone (e.g. +27...)" value={cphone} onChange={(e) => setCphone(e.target.value)} />
        <button className="btn" onClick={addContact}>Add contact</button>

        {contacts.map((c, i) => (
          <div className="card" key={i}>
            <div style={{ fontWeight: 700 }}>{c.name}</div>
            <div className="small">{c.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
"@

WriteFile "client\src\pages\Admin.jsx" @"
import { useState } from "react";
import { api } from "../services/api.js";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  const load = async () => {
    const s = await api.get("/admin/stats");
    setStats(s.data);
    const e = await api.get("/admin/sos");
    setEvents(e.data.items || []);
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 700 }}>Admin dashboard (scaffold)</div>
        <button className="btn" onClick={load}>Load</button>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(stats, null, 2)}</pre>
      </div>

      {events.map(ev => (
        <div className="card" key={ev._id}>
          <div style={{ fontWeight: 700 }}>SOS</div>
          <div className="small">Province: {ev.province || "Unknown"}</div>
          <div className="small">Time: {ev.createdAt}</div>
        </div>
      ))}
      <div className="small">Admin endpoints require admin token in next phase.</div>
    </div>
  );
}
"@

# =========================
# SERVER (Express + Mongo)
# =========================

WriteFile "server\package.json" @"
{
  "name": "dc-emergency-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.5"
  },
  "devDependencies": {
    "nodemon": "^3.1.11"
  }
}
"@

WriteFile "server\.env" @"
PORT=5000
MONGO_URI=PASTE_YOUR_ATLAS_URI_HERE
JWT_SECRET=PASTE_A_LONG_RANDOM_SECRET
DC_ACADEMY_ALERT_EMAIL=dcacademy@example.com
"@

WriteFile "server\config\db.js" @"
import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
"@

WriteFile "server\models\User.js" @"
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  { name: String, phone: String, email: String },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User" },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    province: { type: String, default: "Gauteng" },
    language: { type: String, default: "en" },
    emergencyContacts: { type: [contactSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
"@

WriteFile "server\models\Post.js" @"
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    scope: { type: String, enum: ["national", "province"], default: "national" },
    province: { type: String, default: "" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    sponsored: { type: Boolean, default: false },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
"@

WriteFile "server\models\SosEvent.js" @"
import mongoose from "mongoose";

const sosSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    province: String,
    latitude: Number,
    longitude: Number,
    message: String
  },
  { timestamps: true }
);

export default mongoose.model("SosEvent", sosSchema);
"@

WriteFile "server\models\Ad.js" @"
import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: String,
    imageUrl: String,
    targetScope: { type: String, enum: ["national", "province"], default: "national" },
    targetProvince: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
"@

WriteFile "server\models\AnalyticsEvent.js" @"
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: String, required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsEvent", analyticsSchema);
"@

WriteFile "server\utils\jwt.js" @"
import jwt from "jsonwebtoken";

export function signToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}
"@

WriteFile "server\middleware\authMiddleware.js" @"
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = verifyToken(parts[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function adminOnly(req, res, next) {
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ message: "Admin only" });
}
"@

WriteFile "server\services\riskEngine.js" @"
export function assessRisk(input) {
  // Simple rule-based v1 (upgrade to ML later)
  // Input can include province, recent incidents, time, user answers, etc.
  let score = 0;
  if (input.timeOfDay === "night") score += 2;
  if (input.hasThreats) score += 3;
  if (input.province) score += 1;

  const level = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  return { score, level };
}
"@

WriteFile "server\services\aiTherapist.js" @"
export async function therapistReply(message) {
  // Stub: replace with real model call (OpenAI or other)
  // Keep responses supportive and non-medical.
  if (!message || !message.trim()) return "Tell me what is going on.";

  const lower = message.toLowerCase();
  if (lower.includes("suicide") || lower.includes("kill myself")) {
    return "I am really sorry you are feeling this way. If you are in immediate danger, use the SOS button now or call local emergency services. You are not alone. If you can, reach out to someone you trust right now.";
  }

  return "I hear you. Take a slow breath in for 4 seconds, hold for 2, and out for 6. What is the main thing you are feeling right now?";
}
"@

WriteFile "server\controllers\authController.js" @"
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
"@

WriteFile "server\controllers\postsController.js" @"
import Post from "../models/Post.js";

export async function listPosts(req, res) {
  const scope = req.query.scope || "national";
  const province = req.query.province || "Gauteng";

  const filter = scope === "province" ? { scope: "province", province } : { scope: "national" };
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(50);
  res.json({ posts });
}

export async function createPost(req, res) {
  const { scope, province, title, content } = req.body || {};
  if (!title || !content) return res.status(400).json({ message: "Title and content required" });

  const doc = await Post.create({
    scope: scope === "province" ? "province" : "national",
    province: scope === "province" ? (province || "Gauteng") : "",
    title,
    content,
    sponsored: false,
    authorId: req.user ? req.user._id : null
  });

  res.status(201).json(doc);
}
"@

WriteFile "server\controllers\sosController.js" @"
import SosEvent from "../models/SosEvent.js";

export async function triggerSOS(req, res) {
  const { province, latitude, longitude, message } = req.body || {};

  const doc = await SosEvent.create({
    userId: req.user ? req.user._id : null,
    province: province || "",
    latitude,
    longitude,
    message: message || "SOS"
  });

  // Integrations scaffold:
  // - Email DC Academy (DC_ACADEMY_ALERT_EMAIL)
  // - SMS/WhatsApp emergency contacts
  // These require external provider keys and will be implemented next phase.

  res.status(201).json({ ok: true, sosId: doc._id });
}
"@

WriteFile "server\controllers\aiController.js" @"
import { therapistReply } from "../services/aiTherapist.js";

export async function therapy(req, res) {
  const { message } = req.body || {};
  const reply = await therapistReply(message || "");
  res.json({ reply });
}
"@

WriteFile "server\controllers\riskController.js" @"
import { assessRisk } from "../services/riskEngine.js";

export async function assess(req, res) {
  const input = req.body || {};
  const result = assessRisk(input);
  res.json(result);
}
"@

WriteFile "server\controllers\adsController.js" @"
import Ad from "../models/Ad.js";

export async function listAds(req, res) {
  const ads = await Ad.find({ active: true }).sort({ createdAt: -1 }).limit(20);
  res.json({ ads });
}
"@

WriteFile "server\controllers\analyticsController.js" @"
import AnalyticsEvent from "../models/AnalyticsEvent.js";

export async function track(req, res) {
  const { event, meta } = req.body || {};
  if (!event) return res.status(400).json({ message: "event required" });

  await AnalyticsEvent.create({
    userId: req.user ? req.user._id : null,
    event,
    meta: meta || {}
  });

  res.json({ ok: true });
}
"@

WriteFile "server\controllers\adminController.js" @"
import SosEvent from "../models/SosEvent.js";
import User from "../models/User.js";
import AnalyticsEvent from "../models/AnalyticsEvent.js";

export async function stats(req, res) {
  const users = await User.countDocuments();
  const sosCount = await SosEvent.countDocuments();
  const analyticsCount = await AnalyticsEvent.countDocuments();
  res.json({ users, sosCount, analyticsCount });
}

export async function sosFeed(req, res) {
  const items = await SosEvent.find().sort({ createdAt: -1 }).limit(100);
  res.json({ items });
}
"@

WriteFile "server\routes\auth.js" @"
import express from "express";
import { register, login, me, addContact } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/contacts", protect, addContact);

export default router;
"@

WriteFile "server\routes\posts.js" @"
import express from "express";
import { listPosts, createPost } from "../controllers/postsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listPosts);
router.post("/", protect, createPost);

export default router;
"@

WriteFile "server\routes\sos.js" @"
import express from "express";
import { triggerSOS } from "../controllers/sosController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, triggerSOS);

export default router;
"@

WriteFile "server\routes\ai.js" @"
import express from "express";
import { therapy } from "../controllers/aiController.js";

const router = express.Router();

router.post("/therapy", therapy);

export default router;
"@

WriteFile "server\routes\risk.js" @"
import express from "express";
import { assess } from "../controllers/riskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assess", protect, assess);

export default router;
"@

WriteFile "server\routes\ads.js" @"
import express from "express";
import { listAds } from "../controllers/adsController.js";

const router = express.Router();

router.get("/", listAds);

export default router;
"@

WriteFile "server\routes\analytics.js" @"
import express from "express";
import { track } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", protect, track);

export default router;
"@

WriteFile "server\routes\admin.js" @"
import express from "express";
import { stats, sosFeed } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, stats);
router.get("/sos", protect, adminOnly, sosFeed);

export default router;
"@

WriteFile "server\server.js" @"
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import sosRoutes from "./routes/sos.js";
import aiRoutes from "./routes/ai.js";
import riskRoutes from "./routes/risk.js";
import adsRoutes from "./routes/ads.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log("Server running on port " + PORT));
"@

WriteFile "README.md" @"
DC Emergency Web App (South Africa)

Run backend:
  cd server
  npm install
  npm run dev

Run frontend:
  cd client
  npm install
  npm run dev

Required config:
  server\.env
    PORT=5000
    MONGO_URI=your MongoDB Atlas URI (include db name dc_emergency)
    JWT_SECRET=long random string

Endpoints:
  GET  /api/health
  POST /api/auth/register
  POST /api/auth/login
  GET  /api/auth/me (Bearer token)
  POST /api/auth/contacts (Bearer token)

  GET  /api/posts?scope=national|province&province=Gauteng
  POST /api/posts (Bearer token)

  POST /api/sos (Bearer token)
  POST /api/ai/therapy
  POST /api/risk/assess (Bearer token)
  GET  /api/ads
  POST /api/analytics/track (Bearer token)

Admin:
  GET /api/admin/stats (Bearer token, admin)
  GET /api/admin/sos (Bearer token, admin)

Notes:
- AI therapist is stubbed. Next phase: connect real provider safely.
- SOS email/SMS integrations are scaffolded. Next phase: Twilio/Email provider setup.
"@

# =========================
# INSTALL DEPENDENCIES
# =========================

Write-Host "Installing server dependencies..." -ForegroundColor Yellow
Push-Location "server"
npm install
Pop-Location

Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Push-Location "client"
npm install
Pop-Location

Write-Host "Rebuild complete." -ForegroundColor Green
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "1) Edit server\.env and set MONGO_URI and JWT_SECRET" -ForegroundColor Cyan
Write-Host "2) Start backend: cd server; npm run dev" -ForegroundColor Cyan
Write-Host "3) Start frontend: cd client; npm run dev" -ForegroundColor Cyan
