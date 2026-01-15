$ErrorActionPreference = "Stop"

function WriteUtf8NoBom {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Content
  )

  $dir = Split-Path -Parent $Path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)

  # PowerShell 5.1 safe: resolve if possible, otherwise use raw path
  $resolved = $null
  try { $resolved = (Resolve-Path -LiteralPath $Path -ErrorAction Stop).Path } catch { $resolved = $Path }

  [System.IO.File]::WriteAllText($resolved, $Content, $utf8NoBom)
}

function EnsureLineInFile {
  param(
    [Parameter(Mandatory=$true)][string]$Path,
    [Parameter(Mandatory=$true)][string]$Line
  )

  if (!(Test-Path $Path)) { return }

  $raw = Get-Content $Path -Raw
  if ($raw -notmatch [Regex]::Escape($Line)) {
    $raw2 = ($raw.TrimEnd() + "`r`n" + $Line + "`r`n")
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $raw2, $utf8NoBom)
  }
}

Write-Host "Applying NEXT PHASE patch (PS 5.1 compatible)..." -ForegroundColor Cyan

# -------------------------
# CLIENT PATCHES
# -------------------------
if (!(Test-Path ".\client\src")) { throw "client folder not found. Run rebuild script first." }

# main.jsx (auto-load token)
WriteUtf8NoBom ".\client\src\main.jsx" @"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/app.css";
import { setAuthToken } from "./services/api.js";

const saved = localStorage.getItem("token");
if (saved) setAuthToken(saved);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
"@

# Feed.jsx
WriteUtf8NoBom ".\client\src\pages\Feed.jsx" @"
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

function StoriesBar({ scope, setScope, province, setProvince }) {
  return (
    <div className="card">
      <div className="row" style={{ alignItems: "center" }}>
        <button className="btn" onClick={() => setScope("national")}>National</button>
        <button className="btn" onClick={() => setScope("province")}>Province</button>

        {scope === "province" && (
          <select
            className="input"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            style={{ margin: 0, minWidth: 180 }}
          >
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
        )}
      </div>

      <div className="small" style={{ marginTop: 8 }}>
        Stories-style alerts bar (next: verified alerts + hotspots).
      </div>
    </div>
  );
}

function PostCard({ p }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{p.title}</div>
          <div className="small">
            {p.scope}{p.province ? " - " + p.province : ""}{p.sponsored ? " - Sponsored" : ""}
          </div>
        </div>
        <div className="badge">{p.sponsored ? "AD" : "POST"}</div>
      </div>

      <div style={{ marginTop: 10 }}>{p.content}</div>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn">Like</button>
        <button className="btn">Comment</button>
        <button className="btn">Share</button>
        <button className="btn">Save</button>
      </div>
    </div>
  );
}

function AdCard({ ad }) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 700 }}>{ad.title}</div>
        <div className="badge">Sponsored</div>
      </div>
      <div className="small" style={{ marginTop: 8 }}>
        Ethical ads only. No ads on SOS or crisis flow.
      </div>
    </div>
  );
}

export default function Feed() {
  const [scope, setScope] = useState("national");
  const [province, setProvince] = useState("Gauteng");
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);

  const load = async () => {
    const r1 = await api.get("/posts", { params: { scope, province } });
    setPosts(r1.data.posts || []);
    const r2 = await api.get("/ads");
    setAds(r2.data.ads || []);
  };

  useEffect(() => { load(); }, [scope, province]);

  const feedItems = [];
  let adIndex = 0;
  posts.forEach((p, i) => {
    feedItems.push({ kind: "post", data: p });
    if ((i + 1) % 4 === 0 && ads[adIndex]) feedItems.push({ kind: "ad", data: ads[adIndex++] });
  });

  return (
    <div>
      <StoriesBar scope={scope} setScope={setScope} province={province} setProvince={setProvince} />
      {feedItems.map((item, idx) =>
        item.kind === "post"
          ? <PostCard key={item.data._id || idx} p={item.data} />
          : <AdCard key={"ad-" + idx} ad={item.data} />
      )}
    </div>
  );
}
"@

# App.jsx route: use Feed for "/"
WriteUtf8NoBom ".\client\src\App.jsx" @"
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Feed from "./pages/Feed.jsx";
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
        <Route path="/" element={<Feed />} />
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

# SOS page: big round red centered
WriteUtf8NoBom ".\client\src\pages\SOS.jsx" @"
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
          Main feature: big SOS button centered. Uses /api/sos (requires login).
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
      </div>

      <div className="sos-center">
        <button className="sos-button" onClick={trigger} aria-label="Trigger SOS">SOS</button>
        <div className="small" style={{ marginTop: 14 }}>Status: {status}</div>
      </div>
    </div>
  );
}
"@

# Add SOS CSS block if missing
$cssPath = ".\client\src\styles\app.css"
if (!(Test-Path $cssPath)) { throw "client/src/styles/app.css not found." }
$cssRaw = Get-Content $cssPath -Raw
if ($cssRaw -notmatch "sos-button") {
  $cssAdd = @"

/* SOS main button */
.sos-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
  min-height: 50vh;
}

.sos-button {
  width: 220px;
  height: 220px;
  border-radius: 999px;
  border: 2px solid #b00020;
  background: #b00020;
  color: #fff;
  font-size: 44px;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
}

.sos-button:active { transform: scale(0.98); }
"@
  $cssRaw2 = $cssRaw.TrimEnd() + "`r`n" + $cssAdd + "`r`n"
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($cssPath, $cssRaw2, $utf8NoBom)
}

Write-Host "Client patched OK." -ForegroundColor Green

# -------------------------
# SERVER PATCHES
# -------------------------
if (!(Test-Path ".\server")) { throw "server folder not found. Run rebuild script first." }

# email service
WriteUtf8NoBom ".\server\services\emailService.js" @"
import nodemailer from "nodemailer";

export function makeMailer() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function sendDCAcademyAlert({ to, subject, text }) {
  const transporter = makeMailer();
  if (!transporter) return { skipped: true, reason: "SMTP not configured" };

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text
  });

  return { sent: true };
}
"@

# sos controller
WriteUtf8NoBom ".\server\controllers\sosController.js" @"
import SosEvent from "../models/SosEvent.js";
import { sendDCAcademyAlert } from "../services/emailService.js";

export async function triggerSOS(req, res) {
  const { province, latitude, longitude, message } = req.body || {};
  const finalProvince = province || req.user?.province || "";

  const doc = await SosEvent.create({
    userId: req.user ? req.user._id : null,
    province: finalProvince,
    latitude,
    longitude,
    message: message || "SOS"
  });

  const contacts = req.user?.emergencyContacts || [];
  const dcEmail = process.env.DC_ACADEMY_ALERT_EMAIL;

  const textLines = [
    "DC EMERGENCY SOS ALERT",
    "",
    "User: " + (req.user?.email || "unknown"),
    "Province: " + (finalProvince || "unknown"),
    "Message: " + (doc.message || ""),
    "Location: " + (latitude ? latitude : "n/a") + ", " + (longitude ? longitude : "n/a"),
    "Contacts: " + (contacts.length ? contacts.map(c => `${c.name}:${c.phone || c.email || ""}`).join(" | ") : "none"),
    "",
    "SOS ID: " + String(doc._id)
  ];

  const emailResult = await sendDCAcademyAlert({
    to: dcEmail,
    subject: "SOS ALERT - " + (finalProvince || "SA"),
    text: textLines.join("\n")
  });

  res.status(201).json({ ok: true, sosId: doc._id, emailResult });
}
"@

# ensure env lines exist
EnsureLineInFile ".\server\.env" "SMTP_HOST=smtp.gmail.com"
EnsureLineInFile ".\server\.env" "SMTP_PORT=587"
EnsureLineInFile ".\server\.env" "SMTP_USER=yourgmail@gmail.com"
EnsureLineInFile ".\server\.env" "SMTP_PASS=your_app_password"
EnsureLineInFile ".\server\.env" "SMTP_FROM=DC Emergency <yourgmail@gmail.com>"

Write-Host "Server patched OK." -ForegroundColor Green
Write-Host "Patch complete. Restart server and client." -ForegroundColor Cyan
