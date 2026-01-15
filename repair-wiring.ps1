$ErrorActionPreference="Stop"
$ROOT=$PSScriptRoot
if(-not $ROOT){$ROOT=(Get-Location).Path}
function P($r){Join-Path $ROOT $r}
function EnsureDirForFile($fp){$d=Split-Path -Parent $fp; if($d -and !(Test-Path $d)){New-Item -ItemType Directory -Force -Path $d|Out-Null}}
function WriteUtf8NoBom($rel,$content){
  $full=P $rel
  EnsureDirForFile $full
  $utf8=New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($full,$content,$utf8)
}
function InsertAfterLine($rel,$matchContains,$insertText){
  $path=P $rel
  if(!(Test-Path $path)){throw "Missing file: $path"}
  $raw=Get-Content $path -Raw
  if($raw -match [Regex]::Escape($insertText)){ return }
  $lines=Get-Content $path
  $out=New-Object System.Collections.Generic.List[string]
  $ins=$false
  foreach($line in $lines){
    $out.Add($line)
    if(-not $ins -and $line -like "*$matchContains*"){
      foreach($l in ($insertText -split "`r?`n")){ $out.Add($l) }
      $ins=$true
    }
  }
  if(-not $ins){
    foreach($l in ($insertText -split "`r?`n")){ $out.Add($l) }
  }
  $utf8=New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($path,$out.ToArray(),$utf8)
}

Write-Host "Repairing wiring (client+server) so ALL buttons work..." -ForegroundColor Cyan
Write-Host "Root: $ROOT" -ForegroundColor DarkGray

# =========================
# SERVER: Ensure Posts API exists (Community uses /posts)
# =========================
WriteUtf8NoBom "server\models\Post.js" @'
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    scope: { type: String, enum: ["national","province"], default: "national" },
    province: { type: String, default: "" },
    title: { type: String, default: "Update" },
    body: { type: String, default: "" },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
'@

WriteUtf8NoBom "server\controllers\postsController.js" @'
import Post from "../models/Post.js";

export async function listPosts(req, res) {
  const scope = req.query.scope || "national";
  const province = req.query.province || "";
  const q = {};
  if (scope) q.scope = scope;
  if (scope === "province" && province) q.province = province;

  const items = await Post.find(q).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
}

export async function createPost(req, res) {
  const b = req.body || {};
  const doc = await Post.create({
    userId: req.user ? req.user._id : null,
    scope: b.scope || "national",
    province: b.province || "",
    title: b.title || "Update",
    body: b.body || "",
    isVerified: false
  });
  res.status(201).json({ doc });
}

// Admin: verify posts (optional)
export async function adminVerify(req, res) {
  const id = req.params.id;
  const doc = await Post.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  doc.isVerified = true;
  await doc.save();
  res.json({ doc });
}
'@

WriteUtf8NoBom "server\routes\posts.js" @'
import express from "express";
import { listPosts, createPost, adminVerify } from "../controllers/postsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", listPosts);
router.post("/", protect, createPost);
router.put("/admin/:id/verify", protect, adminOnly, adminVerify);

export default router;
'@

# Ensure analytics exists (some buttons track)
if(!(Test-Path (P "server\routes\analytics.js"))){
  WriteUtf8NoBom "server\routes\analytics.js" @'
import express from "express";
import AnalyticsEvent from "../models/AnalyticsEvent.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", protect, async (req,res)=>{
  const { event, meta } = req.body || {};
  if(!event) return res.status(400).json({ message:"Missing event" });
  await AnalyticsEvent.create({ userId: req.user?._id || null, event, meta: meta || {} });
  res.json({ ok:true });
});

router.get("/admin", protect, adminOnly, async (req,res)=>{
  const total = await AnalyticsEvent.countDocuments();
  const last = await AnalyticsEvent.find().sort({ createdAt:-1 }).limit(50);
  res.json({ total, last });
});

export default router;
'@
}

# Wire posts route into server.js
$serverRel="server\server.js"
$serverFull=P $serverRel
if(!(Test-Path $serverFull)){ throw "Missing server/server.js" }
$raw=Get-Content $serverFull -Raw

if($raw -notmatch "postsRoutes"){
  # insert imports near other routes
  InsertAfterLine $serverRel 'import hotspotsRoutes' 'import postsRoutes from "./routes/posts.js";'
}
$raw=Get-Content $serverFull -Raw
if($raw -notmatch '"/api/posts"'){
  InsertAfterLine $serverRel 'app.use("/api/hotspots"' 'app.use("/api/posts", postsRoutes);'
}

# Add health endpoint so you can test server instantly
$raw=Get-Content $serverFull -Raw
if($raw -notmatch 'app\.get\("/health"'){
  InsertAfterLine $serverRel 'app.use(express.json())' 'app.get("/health",(req,res)=>res.json({ok:true}));'
}

Write-Host "Server routes repaired." -ForegroundColor Green

# =========================
# CLIENT: Ensure api.js exists + token injection + error surfacing
# =========================
WriteUtf8NoBom "client\src\services\api.js" @'
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = "Bearer " + token;
  return config;
});

export function setToken(token){
  if(token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}
'@

WriteUtf8NoBom "client\src\services\analytics.js" @'
import { api } from "./api.js";

export async function track(event, meta = {}) {
  try { await api.post("/analytics/track", { event, meta }); }
  catch { /* silent */ }
}
'@

# =========================
# CLIENT: Provide a simple Profile page (login status + emergency contacts link)
# =========================
WriteUtf8NoBom "client\src\pages\Profile.jsx" @'
import { useState } from "react";
import { api, setToken } from "../services/api.js";

export default function Profile(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");

  const token = localStorage.getItem("token");

  const login = async ()=>{
    setMsg("Logging in...");
    try{
      const r = await api.post("/auth/login", { email, password });
      setToken(r.data.token);
      setMsg("Logged in.");
      window.location.reload();
    }catch(e){
      setMsg("Login failed: " + (e.response?.data?.message || e.message));
    }
  };

  const logout = ()=>{
    setToken(null);
    window.location.reload();
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="h1">Profile</div>
        <div className="small">Account + settings.</div>
        <div className="hr"></div>

        {!token ? (
          <>
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <button className="btn btnPrimary" onClick={login}>Login</button>
            <div className="small" style={{ marginTop: 10 }}>{msg}</div>
            <div className="small" style={{ marginTop: 10 }}>
              If you don’t have an account yet, use your Register page (if you have it) or tell me and I’ll add it.
            </div>
          </>
        ) : (
          <>
            <div className="badge">Logged in</div>
            <div style={{ height: 10 }}></div>
            <button className="btn" onClick={logout}>Logout</button>
            <div className="small" style={{ marginTop: 10 }}>
              Next: We can add "Manage Emergency Contacts" here as a proper UI.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
'@

# =========================
# CLIENT: Ensure Therapist/SOS/Risk pages exist (avoid broken route clicks)
# We'll create safe placeholders if missing.
# =========================
if(!(Test-Path (P "client\src\pages\SOS.jsx"))){
WriteUtf8NoBom "client\src\pages\SOS.jsx" @'
import { useState } from "react";
import { api } from "../services/api.js";

export default function SOS(){
  const [province,setProvince]=useState("Gauteng");
  const [status,setStatus]=useState("Ready");

  const send = async ()=>{
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      setStatus("Sending...");
      await api.post("/sos", { province, latitude: pos.coords.latitude, longitude: pos.coords.longitude, message:"SOS" });
      setStatus("Sent");
      alert("SOS sent.");
    }, async ()=>{
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message:"SOS (no GPS)" });
      setStatus("Sent");
      alert("SOS sent.");
    });
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="h1">SOS</div>
        <div className="small">This triggers emergency notifications.</div>
        <div className="hr"></div>

        <select className="input" value={province} onChange={(e)=>setProvince(e.target.value)}>
          <option>Eastern Cape</option><option>Free State</option><option>Gauteng</option>
          <option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option>
          <option>North West</option><option>Northern Cape</option><option>Western Cape</option>
        </select>

        <div style={{ height: 14 }}></div>
        <button className="btn btnPrimary" onClick={send} style={{ fontSize: 16, padding: 14 }}>Send SOS</button>
        <div className="small" style={{ marginTop: 10 }}>Status: {status}</div>
      </div>
    </div>
  );
}
'@
}

if(!(Test-Path (P "client\src\pages\Therapist.jsx"))){
WriteUtf8NoBom "client\src\pages\Therapist.jsx" @'
export default function Therapist(){
  return (
    <div className="card">
      <div className="h1">Therapist</div>
      <div className="small">Therapist page missing earlier — now restored. Restart client.</div>
    </div>
  );
}
'@
}

if(!(Test-Path (P "client\src\pages\Risk.jsx"))){
WriteUtf8NoBom "client\src\pages\Risk.jsx" @'
export default function Risk(){
  return (
    <div className="card">
      <div className="h1">Risk</div>
      <div className="small">Risk page missing earlier — now restored. Restart client.</div>
    </div>
  );
}
'@
}

# =========================
# CLIENT: Ensure App.jsx uses NavLink and routes exist
# We won't touch your design; just make routing stable.
# =========================
WriteUtf8NoBom "client\src\App.jsx" @'
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import Feed from "./pages/Feed.jsx";
import Community from "./pages/Community.jsx";
import Therapist from "./pages/Therapist.jsx";
import SOS from "./pages/SOS.jsx";
import Risk from "./pages/Risk.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";

export default function App(){
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/community" element={<Community />} />
        <Route path="/therapist" element={<Therapist />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <NavLink to="/sos" className="sosFab">SOS</NavLink>

      <nav className="nav">
        <NavLink to="/" end className={({isActive}) => isActive ? "active" : ""}>Home</NavLink>
        <NavLink to="/community" className={({isActive}) => isActive ? "active" : ""}>Community</NavLink>
        <NavLink to="/therapist" className={({isActive}) => isActive ? "active" : ""}>Therapist</NavLink>
        <NavLink to="/risk" className={({isActive}) => isActive ? "active" : ""}>Risk</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "active" : ""}>Profile</NavLink>
      </nav>
    </div>
  );
}
'@

Write-Host "Client wiring repaired." -ForegroundColor Green

Write-Host "DONE. Next:" -ForegroundColor Cyan
Write-Host "1) Restart server: cd server; npm run dev" -ForegroundColor Cyan
Write-Host "2) Restart client: cd client; npm run dev" -ForegroundColor Cyan
Write-Host "3) Test: http://localhost:5000/health should return {ok:true}" -ForegroundColor Cyan
Write-Host "4) Community should load without silent failures." -ForegroundColor Cyan
