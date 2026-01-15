$ErrorActionPreference = "Stop"

# Always operate from the folder where THIS script is saved
$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = (Get-Location).Path }

function JoinRoot {
  param([string]$Relative)
  return (Join-Path $ROOT $Relative)
}

function EnsureDirForFile {
  param([string]$FilePath)
  $dir = Split-Path -Parent $FilePath
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

function WriteUtf8NoBom {
  param([string]$RelativePath, [string]$Content)
  $full = JoinRoot $RelativePath
  EnsureDirForFile $full
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($full, $Content, $utf8NoBom)
}

function InsertAfterLine {
  param(
    [Parameter(Mandatory=$true)][string]$RelativePath,
    [Parameter(Mandatory=$true)][string]$Match,
    [Parameter(Mandatory=$true)][string]$InsertText
  )

  $path = JoinRoot $RelativePath
  if (!(Test-Path $path)) { throw "File not found: $path" }

  $raw = Get-Content $path -Raw
  if ($raw -match [Regex]::Escape($InsertText)) { return } # already inserted

  $lines = Get-Content $path
  $out = New-Object System.Collections.Generic.List[string]
  $inserted = $false

  foreach ($line in $lines) {
    $out.Add($line)
    if (-not $inserted -and $line -like "*$Match*") {
      foreach ($insLine in ($InsertText -split "`r?`n")) { $out.Add($insLine) }
      $inserted = $true
    }
  }

  if (-not $inserted) {
    foreach ($insLine in ($InsertText -split "`r?`n")) { $out.Add($insLine) }
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($path, $out.ToArray(), $utf8NoBom)
}

Write-Host "Finalizing DC Emergency Web App (bulletproof paths)..." -ForegroundColor Cyan
Write-Host "Root:" $ROOT -ForegroundColor DarkGray

# -------------------------
# SERVER additions
# -------------------------
if (!(Test-Path (JoinRoot "server"))) { throw "server folder not found under: $ROOT" }

WriteUtf8NoBom "server\models\Province.js" @'
import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true },
    emergencyNumbers: {
      police: { type: String, default: "10111" },
      ambulance: { type: String, default: "10177" },
      gbvHelpline: { type: String, default: "0800 428 428" },
      childline: { type: String, default: "116" },
      additional: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Province", provinceSchema);
'@

WriteUtf8NoBom "server\seedProvinces.js" @'
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Province from "./models/Province.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const provinces = [
  "Eastern Cape","Free State","Gauteng","KwaZulu-Natal","Limpopo",
  "Mpumalanga","North West","Northern Cape","Western Cape"
].map(name => ({
  name,
  emergencyNumbers: {
    police: "10111",
    ambulance: "10177",
    gbvHelpline: "0800 428 428",
    childline: "116",
    additional: [
      "GBV Command Centre: 0800 428 428",
      "Childline: 116",
      "Ambulance: 10177",
      "Police: 10111"
    ]
  }
}));

await Province.deleteMany({});
await Province.insertMany(provinces);

console.log("Provinces seeded");
process.exit(0);
'@

WriteUtf8NoBom "server\controllers\provinceController.js" @'
import Province from "../models/Province.js";

export async function listProvinces(req, res) {
  const items = await Province.find().sort({ name: 1 });
  res.json({ items });
}

export async function getProvince(req, res) {
  const name = req.params.name;
  const p = await Province.findOne({ name });
  if (!p) return res.status(404).json({ message: "Province not found" });
  res.json(p);
}
'@

WriteUtf8NoBom "server\routes\provinces.js" @'
import express from "express";
import { listProvinces, getProvince } from "../controllers/provinceController.js";

const router = express.Router();
router.get("/", listProvinces);
router.get("/:name", getProvince);

export default router;
'@

WriteUtf8NoBom "server\controllers\sosController.js" @'
import SosEvent from "../models/SosEvent.js";
import Province from "../models/Province.js";
import { sendDCAcademyAlert } from "../services/emailService.js";

export async function triggerSOS(req, res) {
  const { province, latitude, longitude, message } = req.body || {};
  const finalProvince = province || (req.user && req.user.province) || "";

  const doc = await SosEvent.create({
    userId: req.user ? req.user._id : null,
    province: finalProvince,
    latitude,
    longitude,
    message: message || "SOS"
  });

  const contacts = (req.user && req.user.emergencyContacts) ? req.user.emergencyContacts : [];
  const dcEmail = process.env.DC_ACADEMY_ALERT_EMAIL;

  let provinceInfo = null;
  if (finalProvince) provinceInfo = await Province.findOne({ name: finalProvince });

  const emergencyNumbers = provinceInfo ? provinceInfo.emergencyNumbers : {
    police: "10111",
    ambulance: "10177",
    gbvHelpline: "0800 428 428",
    childline: "116",
    additional: []
  };

  const contactsText = contacts.length
    ? contacts.map(function (c) {
        return (c.name || "Contact") + ":" + (c.phone || c.email || "");
      }).join(" | ")
    : "none";

  const textLines = [
    "DC EMERGENCY SOS ALERT",
    "",
    "User: " + ((req.user && req.user.email) ? req.user.email : "unknown"),
    "Province: " + (finalProvince || "unknown"),
    "Message: " + (doc.message || ""),
    "Location: " + (latitude ? latitude : "n/a") + ", " + (longitude ? longitude : "n/a"),
    "Contacts: " + contactsText,
    "",
    "Emergency Numbers (SA):",
    "Police: " + emergencyNumbers.police,
    "Ambulance: " + emergencyNumbers.ambulance,
    "GBV Helpline: " + emergencyNumbers.gbvHelpline,
    "Childline: " + emergencyNumbers.childline,
    "",
    "SOS ID: " + String(doc._id)
  ];

  let emailResult = { skipped: true, reason: "not attempted" };
  try {
    emailResult = await sendDCAcademyAlert({
      to: dcEmail,
      subject: "SOS ALERT - " + (finalProvince || "SA"),
      text: textLines.join("\n")
    });
  } catch (e) {
    emailResult = { sent: false, error: e.message };
  }

  res.status(201).json({ ok: true, sosId: doc._id, emergencyNumbers, emailResult });
}
'@

# Patch server.js (safe insert)
$serverJsPath = "server\server.js"
$serverJsFull = JoinRoot $serverJsPath
if (!(Test-Path $serverJsFull)) { throw "server/server.js not found at $serverJsFull" }

$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch "provincesRoutes") {
  InsertAfterLine $serverJsPath "import adminRoutes" 'import provincesRoutes from "./routes/provinces.js";'
}

$raw = Get-Content $serverJsFull -Raw
if ($raw -notmatch '"/api/provinces"') {
  InsertAfterLine $serverJsPath 'app.use("/api/admin"' 'app.use("/api/provinces", provincesRoutes);'
}

WriteUtf8NoBom "server\makeAdmin.js" @'
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

const email = process.argv[2];
const password = process.argv[3] || "Admin123!";

if (!email) {
  console.log("Usage: node makeAdmin.js admin@email.com Admin123!");
  process.exit(1);
}

let user = await User.findOne({ email });
if (!user) {
  const passwordHash = await bcrypt.hash(password, 10);
  user = await User.create({ email, passwordHash, name: "Admin", isAdmin: true });
} else {
  user.isAdmin = true;
  await user.save();
}

console.log("Admin ready:", user.email);
process.exit(0);
'@

# Install nodemailer
Push-Location (JoinRoot "server")
npm install nodemailer | Out-Null
Pop-Location

Write-Host "Server finalized OK." -ForegroundColor Green

# -------------------------
# CLIENT analytics helper
# -------------------------
if (!(Test-Path (JoinRoot "client\src"))) { throw "client folder not found under: $ROOT" }

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

# Patch App.jsx to track page views if not already
$appPath = "client\src\App.jsx"
$appFull = JoinRoot $appPath
$appRaw = Get-Content $appFull -Raw

if ($appRaw -notmatch "useLocation") {
  $appRaw = $appRaw -replace 'import \{ Routes, Route, Navigate, Link \} from "react-router-dom";',
    'import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";' + "`r`n" +
    'import { useEffect } from "react";' + "`r`n" +
    'import { track } from "./services/analytics.js";'

  $appRaw = $appRaw -replace 'export default function App\(\) \{',
    'export default function App() {' + "`r`n" +
    '  const location = useLocation();' + "`r`n" +
    '  useEffect(() => { track("page_view", { path: location.pathname }); }, [location.pathname]);'

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($appFull, $appRaw, $utf8NoBom)
}

Write-Host "Client finalized OK." -ForegroundColor Green

Write-Host "Finalization complete." -ForegroundColor Cyan
Write-Host "Next actions:" -ForegroundColor Cyan
Write-Host "1) cd server; node seedProvinces.js" -ForegroundColor Cyan
Write-Host "2) cd server; node makeAdmin.js your@email.com Admin123!" -ForegroundColor Cyan
Write-Host "3) cd server; npm run dev" -ForegroundColor Cyan
Write-Host "4) cd client; npm run dev" -ForegroundColor Cyan
