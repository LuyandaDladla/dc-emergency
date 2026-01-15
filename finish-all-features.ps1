$ErrorActionPreference = "Stop"

$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = (Get-Location).Path }

function P($rel) { return (Join-Path $ROOT $rel) }

function EnsureDirForFile($filePath) {
  $dir = Split-Path -Parent $filePath
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

function WriteUtf8NoBom($relPath, $content) {
  $full = P $relPath
  EnsureDirForFile $full
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($full, $content, $utf8NoBom)
}

function InsertAfterLine {
  param(
    [string]$relPath,
    [string]$matchContains,
    [string]$insertText
  )
  $path = P $relPath
  if (!(Test-Path $path)) { throw "File not found: $path" }

  $raw = Get-Content $path -Raw
  if ($raw -match [Regex]::Escape($insertText)) { return }

  $lines = Get-Content $path
  $out = New-Object System.Collections.Generic.List[string]
  $inserted = $false

  foreach ($line in $lines) {
    $out.Add($line)
    if (-not $inserted -and $line -like "*$matchContains*") {
      foreach ($l in ($insertText -split "`r?`n")) { $out.Add($l) }
      $inserted = $true
    }
  }

  if (-not $inserted) {
    foreach ($l in ($insertText -split "`r?`n")) { $out.Add($l) }
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($path, $out.ToArray(), $utf8NoBom)
}

Write-Host "Finishing ALL features..." -ForegroundColor Cyan
Write-Host "Root:" $ROOT -ForegroundColor DarkGray

# -------------------------
# SERVER: models
# -------------------------
if (!(Test-Path (P "server"))) { throw "Missing server folder under $ROOT" }

WriteUtf8NoBom "server\models\Ad.js" @'
import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, default: "" },
    advertiser: { type: String, default: "Sponsor" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);
'@

WriteUtf8NoBom "server\models\AnalyticsEvent.js" @'
import mongoose from "mongoose";

const analyticsEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    event: { type: String, required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("AnalyticsEvent", analyticsEventSchema);
'@

WriteUtf8NoBom "server\models\RiskResult.js" @'
import mongoose from "mongoose";

const riskResultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    score: { type: Number, required: true },
    level: { type: String, required: true }, // low/medium/high
    answers: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("RiskResult", riskResultSchema);
'@

WriteUtf8NoBom "server\models\TherapistMessage.js" @'
import mongoose from "mongoose";

const therapistMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("TherapistMessage", therapistMessageSchema);
'@

# -------------------------
# SERVER: controllers + routes
# -------------------------
WriteUtf8NoBom "server\controllers\adsController.js" @'
import Ad from "../models/Ad.js";

export async function listAds(req, res) {
  const ads = await Ad.find({ active: true }).sort({ createdAt: -1 }).limit(20);
  res.json({ ads });
}
'@

WriteUtf8NoBom "server\routes\ads.js" @'
import express from "express";
import { listAds } from "../controllers/adsController.js";

const router = express.Router();
router.get("/", listAds);

export default router;
'@

WriteUtf8NoBom "server\controllers\analyticsController.js" @'
import AnalyticsEvent from "../models/AnalyticsEvent.js";

export async function trackEvent(req, res) {
  const userId = req.user ? req.user._id : null;
  const { event, meta } = req.body || {};
  if (!event) return res.status(400).json({ message: "Missing event" });

  await AnalyticsEvent.create({ userId, event, meta: meta || {} });
  res.json({ ok: true });
}

export async function adminStats(req, res) {
  const total = await AnalyticsEvent.countDocuments();
  const last = await AnalyticsEvent.find().sort({ createdAt: -1 }).limit(25);
  res.json({ total, last });
}
'@

WriteUtf8NoBom "server\routes\analytics.js" @'
import express from "express";
import { trackEvent, adminStats } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", protect, trackEvent);
router.get("/admin", protect, adminOnly, adminStats);

export default router;
'@

WriteUtf8NoBom "server\controllers\riskController.js" @'
import RiskResult from "../models/RiskResult.js";

function computeScore(answers) {
  // Simple v1 rules engine (expand later)
  // Expected answers keys: q1..q8 with values 0..3
  let score = 0;
  for (const k of Object.keys(answers || {})) {
    const v = Number(answers[k] || 0);
    if (!isNaN(v)) score += v;
  }
  return score;
}

function levelFromScore(score) {
  if (score >= 16) return "high";
  if (score >= 8) return "medium";
  return "low";
}

export async function assessRisk(req, res) {
  const answers = (req.body && req.body.answers) ? req.body.answers : {};
  const score = computeScore(answers);
  const level = levelFromScore(score);

  const doc = await RiskResult.create({
    userId: req.user._id,
    score,
    level,
    answers
  });

  const recommendations = [];
  if (level === "high") {
    recommendations.push("Consider triggering SOS if you are in danger.");
    recommendations.push("Contact a trusted person and share your location.");
    recommendations.push("Call GBV helpline 0800 428 428.");
  } else if (level === "medium") {
    recommendations.push("Speak to someone you trust and create a safety plan.");
    recommendations.push("Use the therapist chat for support.");
  } else {
    recommendations.push("Keep monitoring your situation and stay connected to support.");
  }

  res.json({ ok: true, score, level, recommendations, savedId: doc._id });
}

export async function myLatest(req, res) {
  const doc = await RiskResult.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ doc });
}

export async function adminSummary(req, res) {
  const total = await RiskResult.countDocuments();
  const high = await RiskResult.countDocuments({ level: "high" });
  const medium = await RiskResult.countDocuments({ level: "medium" });
  const low = await RiskResult.countDocuments({ level: "low" });
  res.json({ total, high, medium, low });
}
'@

WriteUtf8NoBom "server\routes\risk.js" @'
import express from "express";
import { assessRisk, myLatest, adminSummary } from "../controllers/riskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assess", protect, assessRisk);
router.get("/me/latest", protect, myLatest);
router.get("/admin/summary", protect, adminOnly, adminSummary);

export default router;
'@

WriteUtf8NoBom "server\controllers\therapistController.js" @'
import TherapistMessage from "../models/TherapistMessage.js";

function safeReply(userText) {
  const t = (userText || "").toLowerCase();

  // Crisis-ish detection (very basic)
  const crisis = t.includes("suicide") || t.includes("kill myself") || t.includes("i want to die") || t.includes("self harm");

  if (crisis) {
    return "I am really sorry you are feeling this way. If you are in immediate danger, please press the SOS button now or contact someone you trust right away. You can also call emergency services (10111) or ambulance (10177). If you want, tell me where you are and whether you are safe right now.";
  }

  // Supportive, non-medical
  return "Thank you for sharing that. I am here with you. Can you tell me what happened today, and what you need most right now: safety, calm, advice, or someone to listen?";
}

export async function sendMessage(req, res) {
  const text = (req.body && req.body.text) ? String(req.body.text) : "";
  if (!text.trim()) return res.status(400).json({ message: "Missing text" });

  await TherapistMessage.create({ userId: req.user._id, role: "user", text });

  const reply = safeReply(text);
  await TherapistMessage.create({ userId: req.user._id, role: "assistant", text: reply });

  res.json({ reply });
}

export async function history(req, res) {
  const msgs = await TherapistMessage.find({ userId: req.user._id }).sort({ createdAt: 1 }).limit(200);
  res.json({ msgs });
}

export async function adminCounts(req, res) {
  const total = await TherapistMessage.countDocuments();
  res.json({ total });
}
'@

WriteUtf8NoBom "server\routes\therapist.js" @'
import express from "express";
import { sendMessage, history, adminCounts } from "../controllers/therapistController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/history", protect, history);
router.post("/message", protect, sendMessage);
router.get("/admin/counts", protect, adminOnly, adminCounts);

export default router;
'@

# Seed ads
WriteUtf8NoBom "server\seedAds.js" @'
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Ad from "./models/Ad.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const ads = [
  { title: "Sponsored: Self-defense training", body: "Learn basic self-defense skills safely.", advertiser: "Partner A", active: true },
  { title: "Sponsored: Wellness counseling", body: "Affordable counseling resources.", advertiser: "Partner B", active: true },
  { title: "Sponsored: Community support groups", body: "Find support near you.", advertiser: "Partner C", active: true }
];

await Ad.deleteMany({});
await Ad.insertMany(ads);

console.log("Ads seeded");
process.exit(0);
'@

# -------------------------
# SERVER: wire routes into server.js (safe inserts)
# -------------------------
$serverJsRel = "server\server.js"
$serverJsFull = P $serverJsRel
if (!(Test-Path $serverJsFull)) { throw "Missing server/server.js" }

$raw = Get-Content $serverJsFull -Raw

if ($raw -notmatch "adsRoutes") {
  InsertAfterLine $serverJsRel "import provincesRoutes" 'import adsRoutes from "./routes/ads.js";'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch "analyticsRoutes") {
  InsertAfterLine $serverJsRel "import adsRoutes" 'import analyticsRoutes from "./routes/analytics.js";'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch "riskRoutes") {
  InsertAfterLine $serverJsRel "import analyticsRoutes" 'import riskRoutes from "./routes/risk.js";'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch "therapistRoutes") {
  InsertAfterLine $serverJsRel "import riskRoutes" 'import therapistRoutes from "./routes/therapist.js";'
}

$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch 'app\.use\("/api/ads"') {
  InsertAfterLine $serverJsRel 'app.use("/api/provinces"' 'app.use("/api/ads", adsRoutes);'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch 'app\.use\("/api/analytics"') {
  InsertAfterLine $serverJsRel 'app.use("/api/ads"' 'app.use("/api/analytics", analyticsRoutes);'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch 'app\.use\("/api/risk"') {
  InsertAfterLine $serverJsRel 'app.use("/api/analytics"' 'app.use("/api/risk", riskRoutes);'
}
$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch 'app\.use\("/api/therapist"') {
  InsertAfterLine $serverJsRel 'app.use("/api/risk"' 'app.use("/api/therapist", therapistRoutes);'
}

# Install deps (server)
Push-Location (P "server")
npm install nodemailer | Out-Null
Pop-Location

Write-Host "Server features done." -ForegroundColor Green

# -------------------------
# CLIENT: pages + nav (Risk + Therapist wired + analytics tracking)
# -------------------------
if (!(Test-Path (P "client\src"))) { throw "Missing client/src" }

# Analytics helper (client)
WriteUtf8NoBom "client\src\services\analytics.js" @'
import { api } from "./api.js";

export async function track(event, meta = {}) {
  try {
    await api.post("/analytics/track", { event, meta });
  } catch {
    // silent
  }
}
'@

# Risk page
WriteUtf8NoBom "client\src\pages\Risk.jsx" @'
import { useState } from "react";
import { api } from "../services/api.js";
import { track } from "../services/analytics.js";

const questions = [
  { key: "q1", text: "Do you feel unsafe at home?", max: 3 },
  { key: "q2", text: "Has someone threatened you recently?", max: 3 },
  { key: "q3", text: "Are you being controlled (money/phone/movement)?", max: 3 },
  { key: "q4", text: "Have you been physically harmed recently?", max: 3 },
  { key: "q5", text: "Do you fear reporting due to retaliation?", max: 3 },
  { key: "q6", text: "Is there a history of violence?", max: 3 },
  { key: "q7", text: "Are children at risk?", max: 3 },
  { key: "q8", text: "Do you have a safe person you can contact?", max: 3 }
];

export default function Risk() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const setVal = (k, v) => setAnswers({ ...answers, [k]: Number(v) });

  const submit = async () => {
    track("risk_submit", {});
    const r = await api.post("/risk/assess", { answers });
    setResult(r.data);
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 800 }}>Risk Assessment</div>
        <div className="small">Answer honestly (0 = no, 3 = very serious).</div>
      </div>

      {questions.map(q => (
        <div className="card" key={q.key}>
          <div style={{ fontWeight: 700 }}>{q.text}</div>
          <input
            className="input"
            type="range"
            min="0"
            max={q.max}
            value={answers[q.key] || 0}
            onChange={(e) => setVal(q.key, e.target.value)}
          />
          <div className="small">Score: {answers[q.key] || 0}</div>
        </div>
      ))}

      <button className="btn primary" onClick={submit}>Get Result</button>

      {result && (
        <div className="card">
          <div style={{ fontWeight: 800 }}>Result: {result.level.toUpperCase()}</div>
          <div className="small">Score: {result.score}</div>
          <div style={{ marginTop: 10 }}>
            {(result.recommendations || []).map((x, i) => (
              <div key={i} style={{ marginBottom: 6 }}>- {x}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
'@

# Therapist page (real API)
WriteUtf8NoBom "client\src\pages\Therapist.jsx" @'
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { track } from "../services/analytics.js";

export default function Therapist() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");

  const load = async () => {
    const r = await api.get("/therapist/history");
    setMsgs(r.data.msgs || []);
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    track("therapist_message", {});
    const r = await api.post("/therapist/message", { text: t });
    // reload to include saved messages
    await load();
  };

  return (
    <div>
      <div className="card">
        <div style={{ fontWeight: 800 }}>AI Therapist</div>
        <div className="small">Supportive chat. If you are in danger, use SOS immediately.</div>
      </div>

      <div className="card" style={{ minHeight: 260 }}>
        {msgs.map((m, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div className="small" style={{ fontWeight: 700 }}>{m.role.toUpperCase()}</div>
            <div>{m.text}</div>
          </div>
        ))}
      </div>

      <div className="row">
        <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here..." />
        <button className="btn primary" onClick={send}>Send</button>
      </div>
    </div>
  );
}
'@

# Patch App.jsx safely: ensure it includes Risk route + nav + simple page view tracking
$appPath = P "client\src\App.jsx"
if (!(Test-Path $appPath)) { throw "Missing App.jsx" }
$appRaw = Get-Content $appPath -Raw

# Ensure Risk import exists
if ($appRaw -notmatch 'import Risk from "\.\/pages\/Risk\.jsx";') {
  InsertAfterLine "client\src\App.jsx" 'import SOS from "./pages/SOS.jsx";' 'import Risk from "./pages/Risk.jsx";'
}

# Ensure route exists
$appRaw = Get-Content $appPath -Raw
if ($appRaw -notmatch 'path="/risk"') {
  InsertAfterLine "client\src\App.jsx" '<Route path="/sos"' '        <Route path="/risk" element={<Risk />} />'
}

# Ensure nav link exists
$appRaw = Get-Content $appPath -Raw
if ($appRaw -notmatch 'to="/risk"') {
  InsertAfterLine "client\src\App.jsx" '<Link to="/sos">' '        <Link to="/risk">Risk</Link>'
}

# Add button styles if missing
$cssPath = P "client\src\styles\app.css"
if (Test-Path $cssPath) {
  $css = Get-Content $cssPath -Raw
  if ($css -notmatch "\.btn\.primary") {
    $add = @'
.btn.primary {
  background: #111827;
  color: #ffffff;
  border: 1px solid #111827;
}
'@
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($cssPath, ($css.TrimEnd() + "`r`n" + $add + "`r`n"), $utf8NoBom)
  }
}

Write-Host "Client features done." -ForegroundColor Green

Write-Host "DONE: All features wired. Next: seed + run." -ForegroundColor Cyan
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "  cd server; node seedProvinces.js; node seedAds.js; node makeAdmin.js your@email.com Admin123!; npm run dev" -ForegroundColor Cyan
Write-Host "  (new terminal) cd client; npm run dev" -ForegroundColor Cyan
