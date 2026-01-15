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
function AppendIfMissing($rel,$needle,$append){
  $path=P $rel
  if(!(Test-Path $path)){ throw "Missing file: $path" }
  $raw=Get-Content $path -Raw
  if($raw -match [Regex]::Escape($needle)){ return }
  $utf8=New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($path, $raw + "`r`n" + $append, $utf8)
}

Write-Host "Polishing UI + adding profile pictures..." -ForegroundColor Cyan

# =========================
# 1) CLIENT CSS tweaks (select dropdown dark, header cleaner)
# =========================
$cssPath="client\src\styles\app.css"
if(!(Test-Path (P $cssPath))){ throw "Missing $cssPath" }

AppendIfMissing $cssPath "/* polish-select */" @'
/* polish-select */
select.input{
  appearance: none;
  background: rgba(255,255,255,.03);
  color: var(--text);
}
select.input option{
  background: #0f1620;
  color: rgba(255,255,255,.92);
}
.provinceRow{
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:space-between;
  margin-top: 10px;
}
.provinceSmall{
  max-width: 240px;
  padding: 8px 10px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
}
.topBar{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
}
.brandLeft{
  display:flex;
  flex-direction:column;
  gap:2px;
}
.brandTitle{
  font-size:20px;
  font-weight: 950;
  letter-spacing: .2px;
}
.brandTag{
  font-size:12px;
  color: var(--muted);
}
.avatar{
  width:40px;height:40px;border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(255,255,255,.06);
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.avatar img{ width:100%; height:100%; object-fit:cover; }
.avatarText{
  font-weight: 950;
  color: rgba(255,255,255,.88);
  font-size: 13px;
}
.quickGrid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:10px;
  margin-top: 12px;
}
.quickCard{
  border:1px solid var(--border);
  background: rgba(255,255,255,.03);
  border-radius: 14px;
  padding: 12px;
  cursor:pointer;
}
.quickCard:hover{ background: rgba(255,255,255,.06); }
.quickTitle{ font-weight: 950; }
.quickSub{ font-size: 12px; color: var(--muted); margin-top: 6px; line-height:1.3; }
'@

# =========================
# 2) CLIENT: Avatar component
# =========================
WriteUtf8NoBom "client\src\components\Avatar.jsx" @'
export default function Avatar({ url, name="User" }){
  const initials = (name || "U").split(" ").filter(Boolean).slice(0,2).map(s=>s[0].toUpperCase()).join("");
  return (
    <div className="avatar" title={name}>
      {url ? <img src={url} alt={name} /> : <div className="avatarText">{initials || "U"}</div>}
    </div>
  );
}
'@

# =========================
# 3) CLIENT: Safety Hub Feed polished (province small row + quick actions)
# =========================
WriteUtf8NoBom "client\src\pages\Feed.jsx" @'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import VerifiedStories from "../components/VerifiedStories.jsx";
import HotspotModal from "../components/HotspotModal.jsx";
import { useHotspotAlerts } from "../hooks/useHotspotAlerts.js";
import Avatar from "../components/Avatar.jsx";

export default function Feed() {
  const navigate = useNavigate();
  const [province, setProvince] = useState(localStorage.getItem("province") || "Gauteng");
  const [status, setStatus] = useState("");
  const [me, setMe] = useState(null);

  const { alert, clear } = useHotspotAlerts(province);

  useEffect(() => {
    localStorage.setItem("province", province);
  }, [province]);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/users/me");
        setMe(r.data.user);
      } catch {
        setMe(null);
      }
    })();
  }, []);

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
      clear();
      alert("SOS sent.");
    }, async () => {
      setStatus("Location blocked. Sending without GPS...");
      await api.post("/sos", { province, message: "Emergency SOS (no GPS)" });
      setStatus("Sent");
      alert("SOS sent.");
    });
  };

  return (
    <div className="stack">
      <HotspotModal alert={alert} onClose={clear} />

      <div className="card">
        <div className="topBar">
          <div className="brandLeft">
            <div className="brandTitle">Safety Hub</div>
            <div className="brandTag">SOS is the main feature. Everything else supports it.</div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="badge">SA</div>
            <div onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
              <Avatar url={me?.avatarUrl} name={me?.name || me?.email || "User"} />
            </div>
          </div>
        </div>

        <div className="provinceRow">
          <div className="small">Province</div>
          <select
            className="input provinceSmall"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
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
        </div>

        <div className="sosHero">
          <div className="sosHeroTitle">Emergency SOS</div>
          <div className="sosHeroSub">
            One tap sends your location to DC Academy and your emergency contacts.
          </div>

          <div className="sosHeroCircle">
            <button className="sosHeroBtn" onClick={triggerSOS}>SOS</button>
          </div>

          <div className="small" style={{ marginTop: 12 }}>Status: {status || "Ready"}</div>
        </div>

        <div className="quickGrid">
          <div className="quickCard" onClick={() => navigate("/risk")}>
            <div className="quickTitle">Risk Assessment</div>
            <div className="quickSub">Guided questions, clear outcome + next steps.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/therapist")}>
            <div className="quickTitle">AI Therapist</div>
            <div className="quickSub">Support chat with safety escalation rules.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/community")}>
            <div className="quickTitle">Community</div>
            <div className="quickSub">National + province updates and posts.</div>
          </div>
          <div className="quickCard" onClick={() => navigate("/profile")}>
            <div className="quickTitle">Profile</div>
            <div className="quickSub">Emergency contacts + your account.</div>
          </div>
        </div>
      </div>

      <VerifiedStories />
    </div>
  );
}
'@

# =========================
# 4) CLIENT: Profile page upgraded to include avatarUrl update (URL-based)
# =========================
WriteUtf8NoBom "client\src\pages\Profile.jsx" @'
import { useEffect, useState } from "react";
import { api, setToken } from "../services/api.js";
import Avatar from "../components/Avatar.jsx";

export default function Profile(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [msg,setMsg]=useState("");

  const [me,setMe]=useState(null);
  const [name,setName]=useState("");
  const [avatarUrl,setAvatarUrl]=useState("");
  const [province,setProvince]=useState(localStorage.getItem("province") || "Gauteng");

  const token = localStorage.getItem("token");

  const loadMe = async ()=>{
    try{
      const r = await api.get("/users/me");
      setMe(r.data.user);
      setName(r.data.user.name || "");
      setAvatarUrl(r.data.user.avatarUrl || "");
      setProvince(r.data.user.province || province);
    }catch{
      setMe(null);
    }
  };

  useEffect(()=>{
    if(token) loadMe();
  },[token]);

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

  const saveProfile = async ()=>{
    setMsg("Saving...");
    try{
      await api.put("/users/me", { name, avatarUrl, province });
      localStorage.setItem("province", province);
      setMsg("Saved.");
      await loadMe();
    }catch(e){
      setMsg("Save failed: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div className="stack">
      <div className="card">
        <div className="h1">Profile</div>
        <div className="small">Account + emergency settings.</div>
        <div className="hr"></div>

        {!token ? (
          <>
            <input className="input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div style={{ height: 10 }}></div>
            <button className="btn btnPrimary" onClick={login}>Login</button>
            <div className="small" style={{ marginTop: 10 }}>{msg}</div>
          </>
        ) : (
          <>
            <div className="row" style={{ gap: 12 }}>
              <Avatar url={me?.avatarUrl} name={me?.name || me?.email || "User"} />
              <div className="stack" style={{ gap: 6, width:"100%" }}>
                <div className="badge">Logged in</div>
                <div className="small">{me?.email}</div>
              </div>
              <div className="space"></div>
              <button className="btn" onClick={logout}>Logout</button>
            </div>

            <div className="hr"></div>

            <div className="small">Display name</div>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" />

            <div style={{ height: 10 }}></div>
            <div className="small">Profile picture URL (fastest for deployment)</div>
            <input className="input" value={avatarUrl} onChange={(e)=>setAvatarUrl(e.target.value)} placeholder="https://..." />

            <div style={{ height: 10 }}></div>
            <div className="small">Province</div>
            <select className="input" value={province} onChange={(e)=>setProvince(e.target.value)}>
              <option>Eastern Cape</option><option>Free State</option><option>Gauteng</option>
              <option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option>
              <option>North West</option><option>Northern Cape</option><option>Western Cape</option>
            </select>

            <div style={{ height: 12 }}></div>
            <button className="btn btnPrimary" onClick={saveProfile}>Save</button>

            <div className="small" style={{ marginTop: 10 }}>{msg}</div>

            <div className="hr"></div>
            <div className="small">
              Next: I can add a full “Emergency Contacts” manager here (add/edit/remove, WhatsApp/SMS).
            </div>
          </>
        )}
      </div>
    </div>
  );
}
'@

# =========================
# 5) SERVER: Add avatarUrl + name + province to User model (safe patch by overwrite if needed)
# =========================
# We'll create/overwrite server/models/User.js with a correct schema to prevent syntax issues you had earlier.
WriteUtf8NoBom "server\models\User.js" @'
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    province: { type: String, default: "Gauteng" },

    // Profile picture URL (fastest deploy option)
    avatarUrl: { type: String, default: "" },

    // Emergency contacts (future UI will manage these)
    emergencyContacts: [
      {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        relationship: { type: String, default: "" }
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(entered){
  return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
'@

# =========================
# 6) SERVER: Users "me" routes
# =========================
WriteUtf8NoBom "server\controllers\usersController.js" @'
import User from "../models/User.js";

export async function getMe(req, res){
  const u = await User.findById(req.user._id).select("-password");
  res.json({ user: u });
}

export async function updateMe(req, res){
  const u = await User.findById(req.user._id);
  if(!u) return res.status(404).json({ message:"User not found" });

  const { name, avatarUrl, province } = req.body || {};
  if(name !== undefined) u.name = String(name);
  if(avatarUrl !== undefined) u.avatarUrl = String(avatarUrl);
  if(province !== undefined) u.province = String(province);

  await u.save();
  const safe = await User.findById(u._id).select("-password");
  res.json({ user: safe });
}
'@

WriteUtf8NoBom "server\routes\users.js" @'
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateMe } from "../controllers/usersController.js";

const router = express.Router();
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

export default router;
'@

# =========================
# 7) SERVER: Ensure authMiddleware has adminOnly export (your earlier error)
# =========================
WriteUtf8NoBom "server\middleware\authMiddleware.js" @'
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req,res,next){
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
    token = req.headers.authorization.split(" ")[1];
  }
  if(!token) return res.status(401).json({ message:"Not authorized, no token" });

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if(!req.user) return res.status(401).json({ message:"Not authorized" });
    next();
  }catch(e){
    return res.status(401).json({ message:"Not authorized, token invalid" });
  }
}

export function adminOnly(req,res,next){
  if(req.user && req.user.isAdmin) return next();
  return res.status(403).json({ message:"Admin only" });
}
'@

# =========================
# 8) SERVER: Wire users route into server.js
# =========================
$serverJs=P "server\server.js"
$raw=Get-Content $serverJs -Raw
if($raw -notmatch "usersRoutes"){
  # Add import near other imports
  $lines=Get-Content $serverJs
  $out=New-Object System.Collections.Generic.List[string]
  $added=$false
  foreach($line in $lines){
    $out.Add($line)
    if(-not $added -and $line -like '*import postsRoutes*'){
      $out.Add('import usersRoutes from "./routes/users.js";')
      $added=$true
    }
  }
  if(-not $added){ $out.Add('import usersRoutes from "./routes/users.js";') }
  $utf8=New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($serverJs,$out.ToArray(),$utf8)
}

$raw=Get-Content $serverJs -Raw
if($raw -notmatch '"/api/users"'){
  # Add route after auth route
  $lines=Get-Content $serverJs
  $out=New-Object System.Collections.Generic.List[string]
  $added=$false
  foreach($line in $lines){
    $out.Add($line)
    if(-not $added -and $line -like '*app.use("/api/auth"*'){
      $out.Add('app.use("/api/users", usersRoutes);')
      $added=$true
    }
  }
  if(-not $added){ $out.Add('app.use("/api/users", usersRoutes);') }
  $utf8=New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($serverJs,$out.ToArray(),$utf8)
}

Write-Host "Polish + profile pictures applied." -ForegroundColor Green
Write-Host "Restart server + client now." -ForegroundColor Cyan
Write-Host "Server: cd server; npm run dev" -ForegroundColor Cyan
Write-Host "Client: cd client; npm run dev" -ForegroundColor Cyan
