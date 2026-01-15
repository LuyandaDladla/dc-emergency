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

Write-Host "Applying next upgrade (Hotspots + Community polish + Ads policy)..." -ForegroundColor Cyan
Write-Host "Root: $ROOT" -ForegroundColor DarkGray

# =========================
# SERVER: Hotspot model
# =========================
WriteUtf8NoBom "server\models\Hotspot.js" @'
import mongoose from "mongoose";

const hotspotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    province: { type: String, required: true },
    severity: { type: String, enum: ["low","medium","high"], default: "medium" },
    // Circle geofence
    centerLat: { type: Number, required: true },
    centerLng: { type: Number, required: true },
    radiusMeters: { type: Number, required: true },
    verified: { type: Boolean, default: true },
    notes: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Hotspot", hotspotSchema);
'@

# =========================
# SERVER: Hotspot controller + routes
# =========================
WriteUtf8NoBom "server\controllers\hotspotController.js" @'
import Hotspot from "../models/Hotspot.js";

export async function listHotspots(req, res) {
  const province = req.query.province;
  const q = { active: true };
  if (province) q.province = province;
  const items = await Hotspot.find(q).sort({ severity: -1, createdAt: -1 }).limit(200);
  res.json({ items });
}

export async function listVerifiedStories(req, res) {
  // return a small set for "stories bar"
  const items = await Hotspot.find({ active: true, verified: true })
    .sort({ severity: -1, createdAt: -1 })
    .limit(12);

  const stories = items.map(h => ({
    type: "hotspot",
    id: String(h._id),
    title: h.title,
    province: h.province,
    severity: h.severity
  }));

  res.json({ stories });
}

// Admin CRUD
export async function adminList(req, res) {
  const items = await Hotspot.find().sort({ createdAt: -1 }).limit(500);
  res.json({ items });
}

export async function adminCreate(req, res) {
  const b = req.body || {};
  const doc = await Hotspot.create({
    title: b.title,
    province: b.province,
    severity: b.severity || "medium",
    centerLat: Number(b.centerLat),
    centerLng: Number(b.centerLng),
    radiusMeters: Number(b.radiusMeters || 500),
    verified: b.verified !== false,
    notes: b.notes || "",
    active: b.active !== false
  });
  res.status(201).json({ doc });
}

export async function adminUpdate(req, res) {
  const id = req.params.id;
  const b = req.body || {};
  const doc = await Hotspot.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });

  const fields = ["title","province","severity","centerLat","centerLng","radiusMeters","verified","notes","active"];
  for (const f of fields) if (b[f] !== undefined) doc[f] = b[f];
  await doc.save();

  res.json({ doc });
}

export async function adminDelete(req, res) {
  const id = req.params.id;
  await Hotspot.findByIdAndDelete(id);
  res.json({ ok: true });
}
'@

WriteUtf8NoBom "server\routes\hotspots.js" @'
import express from "express";
import {
  listHotspots,
  listVerifiedStories,
  adminList,
  adminCreate,
  adminUpdate,
  adminDelete
} from "../controllers/hotspotController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public (logged-in optional; you can add protect later if you want)
router.get("/", listHotspots);
router.get("/stories", listVerifiedStories);

// admin
router.get("/admin/all", protect, adminOnly, adminList);
router.post("/admin", protect, adminOnly, adminCreate);
router.put("/admin/:id", protect, adminOnly, adminUpdate);
router.delete("/admin/:id", protect, adminOnly, adminDelete);

export default router;
'@

# =========================
# SERVER: seed hotspots (example)
# =========================
WriteUtf8NoBom "server\seedHotspots.js" @'
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Hotspot from "./models/Hotspot.js";

dotenv.config();
await connectDB(process.env.MONGO_URI);

// Example starter hotspots (adjust to real data later)
const items = [
  { title:"CBD Safety Alert", province:"Gauteng", severity:"high", centerLat:-26.2041, centerLng:28.0473, radiusMeters:1200, verified:true, notes:"Example hotspot" },
  { title:"Night Travel Caution", province:"KwaZulu-Natal", severity:"medium", centerLat:-29.8587, centerLng:31.0218, radiusMeters:900, verified:true, notes:"Example hotspot" },
  { title:"Community Watch Area", province:"Western Cape", severity:"medium", centerLat:-33.9249, centerLng:18.4241, radiusMeters:800, verified:true, notes:"Example hotspot" }
];

await Hotspot.deleteMany({});
await Hotspot.insertMany(items);

console.log("Hotspots seeded");
process.exit(0);
'@

# =========================
# SERVER: wire hotspots route in server.js
# =========================
$serverRel="server\server.js"
$serverFull=P $serverRel
if(!(Test-Path $serverFull)){ throw "Missing server.js" }

$raw=Get-Content $serverFull -Raw
if($raw -notmatch "hotspotsRoutes"){
  InsertAfterLine $serverRel 'import therapistRoutes' 'import hotspotsRoutes from "./routes/hotspots.js";'
}
$raw=Get-Content $serverFull -Raw
if($raw -notmatch '"/api/hotspots"'){
  InsertAfterLine $serverRel 'app.use("/api/therapist"' 'app.use("/api/hotspots", hotspotsRoutes);'
}

Write-Host "Server hotspots added." -ForegroundColor Green

# =========================
# CLIENT: geofence helper
# =========================
WriteUtf8NoBom "client\src\services\geo.js" @'
export function distanceMeters(lat1,lng1,lat2,lng2){
  const R=6371000;
  const toRad=(x)=>x*Math.PI/180;
  const dLat=toRad(lat2-lat1);
  const dLng=toRad(lng2-lng1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(a));
}
'@

# =========================
# CLIENT: Hotspot detector hook
# =========================
WriteUtf8NoBom "client\src\hooks\useHotspotAlerts.js" @'
import { useEffect, useRef, useState } from "react";
import { api } from "../services/api.js";
import { distanceMeters } from "../services/geo.js";
import { track } from "../services/analytics.js";

export function useHotspotAlerts(province){
  const [alert,setAlert]=useState(null);
  const seenRef=useRef(new Set());

  useEffect(()=>{
    let stop=false;
    let watchId=null;
    let hotspots=[];

    async function load(){
      try{
        const r=await api.get("/hotspots", { params: province ? { province } : {} });
        hotspots=r.data.items||[];
      }catch{ hotspots=[]; }
    }

    function startWatch(){
      if(!navigator.geolocation) return;
      watchId=navigator.geolocation.watchPosition((pos)=>{
        const lat=pos.coords.latitude;
        const lng=pos.coords.longitude;

        for(const h of hotspots){
          const d=distanceMeters(lat,lng,h.centerLat,h.centerLng);
          if(d <= h.radiusMeters){
            const key=String(h._id);
            if(!seenRef.current.has(key)){
              seenRef.current.add(key);
              setAlert({
                title: h.title,
                province: h.province,
                severity: h.severity,
                radiusMeters: h.radiusMeters
              });
              track("hotspot_enter", { hotspotId: key, province: h.province, severity: h.severity });
            }
          }
        }
      }, ()=>{}, { enableHighAccuracy:true, maximumAge: 5000, timeout: 8000 });
    }

    (async ()=>{
      await load();
      if(stop) return;
      startWatch();
    })();

    return ()=>{
      stop=true;
      if(watchId!==null) navigator.geolocation.clearWatch(watchId);
    };
  }, [province]);

  const clear=()=>setAlert(null);
  return { alert, clear };
}
'@

# =========================
# CLIENT: Polished stories bar (verified alerts)
# =========================
WriteUtf8NoBom "client\src\components\VerifiedStories.jsx" @'
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function VerifiedStories(){
  const [stories,setStories]=useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const r=await api.get("/hotspots/stories");
        setStories(r.data.stories||[]);
      }catch{
        setStories([]);
      }
    })();
  }, []);

  return (
    <div className="card">
      <div className="h2">Verified Alerts</div>
      <div className="small" style={{ marginTop: 6 }}>
        Quick safety updates (hotspots + verified alerts).
      </div>
      <div className="hr"></div>
      <div className="stories">
        {stories.length === 0 && (
          <div className="small">No verified alerts right now.</div>
        )}
        {stories.map(s=>(
          <div className="story" key={s.id}>
            <div className="storyRing"></div>
            <div className="storyLabel">{s.title}</div>
            <div className="storyLabel" style={{ color:"rgba(255,255,255,.42)" }}>
              {s.province} • {String(s.severity).toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'@

# =========================
# CLIENT: Add hotspot warning modal + ads policy + better community cards
# We will update Feed.jsx + Community.jsx to use VerifiedStories + hotspot alerts hook.
# =========================

WriteUtf8NoBom "client\src\components\HotspotModal.jsx" @'
export default function HotspotModal({ alert, onClose }){
  if(!alert) return null;
  const sev = String(alert.severity||"").toLowerCase();
  const title = sev === "high" ? "High Risk Area" : (sev === "medium" ? "Caution Area" : "Awareness Area");
  return (
    <div style={{
      position:"fixed", left:0, right:0, top:0, bottom:0,
      background:"rgba(0,0,0,.65)",
      display:"flex", alignItems:"center", justifyContent:"center",
      zIndex: 80, padding: 14
    }}>
      <div className="card" style={{ maxWidth: 520, width:"100%" }}>
        <div className="h1">{title}</div>
        <div className="small" style={{ marginTop: 6 }}>
          You entered a hotspot: <b>{alert.title}</b> ({alert.province}). Stay aware and consider safer routes.
        </div>
        <div className="hr"></div>
        <div className="row">
          <button className="btn btnPrimary" onClick={()=>{ window.location.href="/sos"; }}>Open SOS</button>
          <div className="space"></div>
          <button className="btn" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </div>
  );
}
'@

# Patch Feed.jsx to include VerifiedStories + hotspot modal + keep SOS hero
WriteUtf8NoBom "client\src\pages\Feed.jsx" @'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import VerifiedStories from "../components/VerifiedStories.jsx";
import HotspotModal from "../components/HotspotModal.jsx";
import { useHotspotAlerts } from "../hooks/useHotspotAlerts.js";

export default function Feed() {
  const navigate = useNavigate();
  const [province, setProvince] = useState("Gauteng");
  const [status, setStatus] = useState("");

  const { alert, clear } = useHotspotAlerts(province);

  const triggerSOS = async () => {
    setStatus("Getting location...");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      setStatus("Sending...");
      await api.post("/sos", {
        province,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        message: "Emergency SOS"
      });
      setStatus("Sent");
      alert && clear();
      window.alert("SOS sent.");
    }, async () => {
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message: "Emergency SOS (no GPS)" });
      setStatus("Sent");
      window.alert("SOS sent.");
    });
  };

  return (
    <div className="stack">
      <HotspotModal alert={alert} onClose={clear} />

      <div className="card">
        <div className="row">
          <div>
            <div className="h1">Safety Hub</div>
            <div className="small">SOS is the main feature. Everything else supports it.</div>
          </div>
          <div className="space"></div>
          <div className="badge">SA</div>
        </div>

        <div style={{ marginTop: 12 }}>
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
          <div className="small" style={{ marginTop: 8 }}>
            Hotspot alerts are active for your selected province.
          </div>
        </div>

        <div className="sosHero">
          <div className="sosHeroTitle">Emergency SOS</div>
          <div className="sosHeroSub">
            Press SOS to notify DC Academy + your emergency contacts.
          </div>

          <div className="sosHeroCircle">
            <button className="sosHeroBtn" onClick={triggerSOS}>SOS</button>
          </div>

          <div className="small" style={{ marginTop: 12 }}>Status: {status || "Ready"}</div>
        </div>

        <div className="hr"></div>

        <div className="row">
          <button className="btn" onClick={() => navigate("/risk")}>Risk Assessment</button>
          <button className="btn" onClick={() => navigate("/therapist")}>Therapist</button>
          <button className="btn" onClick={() => navigate("/community")}>Community</button>
        </div>
      </div>

      <VerifiedStories />
    </div>
  );
}
'@

# Community page upgrade (Instagram-like cards + national/province toggle + sponsor card)
WriteUtf8NoBom "client\src\pages\Community.jsx" @'
import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";
import { track } from "../services/analytics.js";

function PostCard({ p }){
  return (
    <div className="card">
      <div className="row">
        <div className="badge">{(p.scope||"national").toUpperCase()}</div>
        <div className="badge">{p.province || "SA"}</div>
        <div className="space"></div>
        <div className="small">{new Date(p.createdAt).toLocaleString()}</div>
      </div>
      <div className="hr"></div>
      <div style={{ fontWeight: 900, fontSize: 16 }}>{p.title || "Update"}</div>
      <div className="small" style={{ marginTop: 8 }}>{p.body || ""}</div>

      <div className="hr"></div>
      <div className="row">
        <button className="btn" onClick={()=>track("post_like",{id:p._id})}>Like</button>
        <button className="btn" onClick={()=>track("post_share",{id:p._id})}>Share</button>
        <div className="space"></div>
        <button className="btn" onClick={()=>track("post_report",{id:p._id})}>Report</button>
      </div>
    </div>
  );
}

function SponsorCard({ ad }){
  if(!ad) return null;
  return (
    <div className="card" style={{ borderColor:"rgba(59,130,246,.25)" }}>
      <div className="row">
        <div className="badge">SPONSORED</div>
        <div className="space"></div>
        <div className="small">{ad.advertiser}</div>
      </div>
      <div className="hr"></div>
      <div style={{ fontWeight: 900 }}>{ad.title}</div>
      <div className="small" style={{ marginTop: 8 }}>{ad.body}</div>
    </div>
  );
}

export default function Community(){
  const [mode,setMode]=useState("national"); // national|province
  const [province,setProvince]=useState("Gauteng");
  const [posts,setPosts]=useState([]);
  const [ads,setAds]=useState([]);

  const query = useMemo(()=>{
    if(mode==="province") return { scope:"province", province };
    return { scope:"national" };
  },[mode,province]);

  const load = async ()=>{
    const r = await api.get("/posts", { params: query });
    setPosts(r.data.items || []);
    try{
      const a = await api.get("/ads"); // ads allowed here
      setAds(a.data.ads || []);
    }catch{ setAds([]); }
  };

  useEffect(()=>{ load(); },[mode,province]);

  // Inject one sponsor every 4 posts
  const mixed = useMemo(()=>{
    const out=[];
    let adIdx=0;
    for(let i=0;i<posts.length;i++){
      out.push({ type:"post", data: posts[i] });
      if((i+1)%4===0 && ads[adIdx]){
        out.push({ type:"ad", data: ads[adIdx] });
        adIdx++;
      }
    }
    return out;
  },[posts,ads]);

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <button className={"btn" + (mode==="national" ? " btnPrimary":"")} onClick={()=>setMode("national")}>National</button>
          <button className={"btn" + (mode==="province" ? " btnPrimary":"")} onClick={()=>setMode("province")}>Province</button>
          <div className="space"></div>
          <div className="badge">Community</div>
        </div>

        {mode==="province" && (
          <div style={{ marginTop: 12 }}>
            <select className="input" value={province} onChange={(e)=>setProvince(e.target.value)}>
              <option>Eastern Cape</option><option>Free State</option><option>Gauteng</option>
              <option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option>
              <option>North West</option><option>Northern Cape</option><option>Western Cape</option>
            </select>
            <div className="small" style={{ marginTop: 8 }}>
              Province feed is local updates + community safety posts.
            </div>
          </div>
        )}
      </div>

      {mixed.length===0 && (
        <div className="card">
          <div className="h2">No posts yet</div>
          <div className="small">Once you add posts, they will appear here.</div>
        </div>
      )}

      {mixed.map((x,idx)=>(
        x.type==="ad" ? <SponsorCard key={"ad"+idx} ad={x.data}/> : <PostCard key={x.data._id || idx} p={x.data}/>
      ))}
    </div>
  );
}
'@

Write-Host "Client hotspots + community polish applied." -ForegroundColor Green

Write-Host "Upgrade complete. Next steps:" -ForegroundColor Cyan
Write-Host "1) cd server; node seedHotspots.js" -ForegroundColor Cyan
Write-Host "2) restart server: npm run dev" -ForegroundColor Cyan
Write-Host "3) restart client: npm run dev" -ForegroundColor Cyan
