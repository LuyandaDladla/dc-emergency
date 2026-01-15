$ErrorActionPreference = "Stop"
$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = (Get-Location).Path }

function P($rel){ Join-Path $ROOT $rel }

function EnsureDirForFile($filePath){
  $dir = Split-Path -Parent $filePath
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
}

function WriteUtf8NoBom($relPath, $content){
  $full = P $relPath
  EnsureDirForFile $full
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($full, $content, $utf8NoBom)
}

Write-Host "Applying UI redesign..." -ForegroundColor Cyan

# 1) Global CSS (clean system + Instagram-ish polish + SOS FAB)
WriteUtf8NoBom "client\src\styles\app.css" @'
:root{
  --bg:#0b0f14;
  --panel:#0f1620;
  --panel2:#0c121a;
  --border:rgba(255,255,255,.08);
  --text:rgba(255,255,255,.92);
  --muted:rgba(255,255,255,.64);
  --muted2:rgba(255,255,255,.45);
  --brand:#ff2d55;      /* SOS red */
  --accent:#3b82f6;     /* blue accent */
  --ok:#22c55e;
  --warn:#f59e0b;
  --danger:#ef4444;
  --shadow: 0 12px 28px rgba(0,0,0,.55);
  --radius:18px;
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  background: radial-gradient(1200px 700px at 50% -10%, rgba(59,130,246,.12), transparent 55%),
              radial-gradient(900px 500px at 10% 10%, rgba(255,45,85,.10), transparent 55%),
              var(--bg);
  color:var(--text);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
}

a{ color:inherit; text-decoration:none; }

.container{
  max-width: 980px;
  margin: 0 auto;
  padding: 18px 14px 110px; /* bottom padding for nav + fab */
}

.card{
  background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
  border:1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  box-shadow: 0 10px 26px rgba(0,0,0,.25);
}

.stack{ display:flex; flex-direction:column; gap:12px; }
.row{ display:flex; gap:10px; align-items:center; }
.space{ flex:1; }

.h1{ font-size:22px; font-weight:800; letter-spacing:.2px; }
.h2{ font-size:16px; font-weight:800; letter-spacing:.15px; }
.small{ font-size:13px; color:var(--muted); line-height:1.35; }

.badge{
  padding:6px 10px;
  border-radius: 999px;
  border:1px solid var(--border);
  background: rgba(255,255,255,.03);
  font-size: 12px;
  color: var(--muted);
}

.btn{
  border:1px solid var(--border);
  background: rgba(255,255,255,.03);
  color: var(--text);
  padding: 10px 12px;
  border-radius: 12px;
  cursor:pointer;
  font-weight:700;
}
.btn:hover{ background: rgba(255,255,255,.06); }
.btn:active{ transform: translateY(1px); }

.btnPrimary{
  border:1px solid rgba(255,45,85,.35);
  background: rgba(255,45,85,.14);
  color: var(--text);
}
.btnPrimary:hover{ background: rgba(255,45,85,.20); }

.input{
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255,255,255,.03);
  border:1px solid var(--border);
  color: var(--text);
  outline:none;
}

.hr{
  height:1px; width:100%;
  background: var(--border);
  margin: 10px 0;
}

/* "Stories" bar */
.stories{
  display:flex;
  gap:12px;
  overflow:auto;
  padding: 2px 2px 4px;
}
.story{
  min-width: 74px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:8px;
}
.storyRing{
  width:58px; height:58px;
  border-radius:999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(59,130,246,.35), transparent 40%),
    radial-gradient(circle at 70% 70%, rgba(255,45,85,.35), transparent 40%),
    rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 10px 20px rgba(0,0,0,.35);
}
.storyLabel{
  font-size: 12px;
  color: var(--muted);
  text-align:center;
  white-space:nowrap;
}

/* SOS hero */
.sosHero{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  padding: 18px 12px 14px;
}
.sosHeroTitle{ font-size: 18px; font-weight: 900; }
.sosHeroSub{ color:var(--muted); font-size:13px; margin-top:6px; max-width:420px; }
.sosHeroCircle{
  margin-top:14px;
  width: 210px; height: 210px;
  border-radius: 999px;
  border: 1px solid rgba(255,45,85,.35);
  background:
    radial-gradient(circle at 30% 25%, rgba(255,255,255,.22), transparent 42%),
    radial-gradient(circle at 70% 75%, rgba(0,0,0,.25), transparent 45%),
    rgba(255,45,85,.15);
  box-shadow: 0 26px 46px rgba(0,0,0,.55);
  display:flex; align-items:center; justify-content:center;
}
.sosHeroBtn{
  width: 176px; height: 176px;
  border-radius:999px;
  border: 1px solid rgba(255,45,85,.55);
  background: var(--brand);
  color:#fff;
  font-size: 40px;
  font-weight: 1000;
  letter-spacing: 2px;
  cursor:pointer;
  box-shadow: 0 18px 34px rgba(255,45,85,.18), 0 14px 30px rgba(0,0,0,.45);
}
.sosHeroBtn:active{ transform: scale(.985); }

/* Floating SOS button */
.sosFab{
  position: fixed;
  left: 50%;
  bottom: 62px; /* above nav */
  transform: translateX(-50%);
  width: 74px;
  height: 74px;
  border-radius: 999px;
  border:1px solid rgba(255,45,85,.55);
  background: var(--brand);
  color:#fff;
  font-weight:1000;
  letter-spacing: .8px;
  box-shadow: var(--shadow);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 50;
}
.sosFab:active{ transform: translateX(-50%) scale(.985); }

/* Bottom nav */
.nav{
  position: fixed;
  left:0; right:0; bottom:0;
  background: rgba(10,14,20,.86);
  border-top:1px solid var(--border);
  backdrop-filter: blur(10px);
  display:flex;
  justify-content:space-around;
  padding: 10px 12px 12px;
  z-index: 40;
}
.nav a{
  padding: 8px 10px;
  border-radius: 12px;
  color: var(--muted);
  font-weight: 800;
  font-size: 13px;
}
.nav a.active{
  color: var(--text);
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08);
}

/* Risk UI */
.progress{
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,.06);
  overflow:hidden;
  border: 1px solid rgba(255,255,255,.08);
}
.progress > div{
  height: 100%;
  background: linear-gradient(90deg, rgba(59,130,246,.9), rgba(255,45,85,.9));
  width: 0%;
}
.choiceGrid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;
}
.choice{
  padding: 12px;
  border-radius: 14px;
  border:1px solid var(--border);
  background: rgba(255,255,255,.03);
  cursor:pointer;
  font-weight: 800;
  text-align:center;
}
.choice:hover{ background: rgba(255,255,255,.06); }
.choice.selected{
  border-color: rgba(59,130,246,.55);
  background: rgba(59,130,246,.14);
}
'@

# 2) Home = Safety Hub (replace Feed.jsx)
WriteUtf8NoBom "client\src\pages\Feed.jsx" @'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";

function Stories() {
  const items = [
    { label: "GBV Help", hint: "0800 428 428" },
    { label: "Childline", hint: "116" },
    { label: "Police", hint: "10111" },
    { label: "Ambulance", hint: "10177" },
    { label: "Hotspots", hint: "Soon" }
  ];

  return (
    <div className="card">
      <div className="h2">Alerts</div>
      <div className="small" style={{ marginTop: 6 }}>National + province updates (we will show verified alerts here).</div>
      <div className="hr"></div>
      <div className="stories">
        {items.map((x, i) => (
          <div className="story" key={i}>
            <div className="storyRing"></div>
            <div className="storyLabel">{x.label}</div>
            <div className="storyLabel" style={{ color: "rgba(255,255,255,.42)" }}>{x.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Feed() {
  const navigate = useNavigate();
  const [province, setProvince] = useState("Gauteng");
  const [status, setStatus] = useState("");

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
      <div className="card">
        <div className="row">
          <div>
            <div className="h1">Safety Hub</div>
            <div className="small">Your main safety tools. SOS is always one tap away.</div>
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
            Province affects emergency numbers + localized updates.
          </div>
        </div>

        <div className="sosHero">
          <div className="sosHeroTitle">Emergency SOS</div>
          <div className="sosHeroSub">
            Press SOS to send your location to DC Academy and your emergency contacts.
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

      <Stories />
    </div>
  );
}
'@

# 3) Risk = guided card questionnaire (no sliders)
WriteUtf8NoBom "client\src\pages\Risk.jsx" @'
import { useMemo, useState } from "react";
import { api } from "../services/api.js";

const QUESTIONS = [
  { key: "q1", text: "Do you feel unsafe at home or where you live?" },
  { key: "q2", text: "Has anyone threatened you recently?" },
  { key: "q3", text: "Are you being controlled (money, phone, movement)?" },
  { key: "q4", text: "Have you been physically harmed recently?" },
  { key: "q5", text: "Do you fear retaliation if you report?" },
  { key: "q6", text: "Is there a history of violence or escalation?" },
  { key: "q7", text: "Are children or dependents at risk?" },
  { key: "q8", text: "Do you have a safe person you can contact today?" }
];

const CHOICES = [
  { label: "Never", value: 0 },
  { label: "Sometimes", value: 1 },
  { label: "Often", value: 2 },
  { label: "Dangerous", value: 3 }
];

export default function Risk() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const current = QUESTIONS[step];
  const progress = useMemo(() => Math.round(((step) / QUESTIONS.length) * 100), [step]);

  const pick = (val) => {
    const next = { ...answers, [current.key]: val };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) setStep(step + 1);
  };

  const back = () => setStep(Math.max(0, step - 1));

  const submit = async () => {
    const r = await api.post("/risk/assess", { answers });
    setResult(r.data);
  };

  const donePercent = Math.round(((step + 1) / QUESTIONS.length) * 100);

  if (result) {
    const level = String(result.level || "").toUpperCase();
    return (
      <div className="stack">
        <div className="card">
          <div className="h1">Risk Result</div>
          <div className="small">This is not a medical diagnosis — it is a safety indicator.</div>
          <div className="hr"></div>

          <div className="row">
            <div className="badge">Level: {level}</div>
            <div className="badge">Score: {result.score}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            {(result.recommendations || []).map((x, i) => (
              <div key={i} style={{ marginBottom: 8 }}>- {x}</div>
            ))}
          </div>

          <div className="hr"></div>
          <div className="row">
            <button className="btn btnPrimary" onClick={() => window.location.href="/sos"}>Go to SOS</button>
            <button className="btn" onClick={() => window.location.reload()}>Retake</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <div className="card">
        <div className="row">
          <div>
            <div className="h1">Risk Assessment</div>
            <div className="small">Step {step + 1} of {QUESTIONS.length}</div>
          </div>
          <div className="space"></div>
          <div className="badge">{donePercent}%</div>
        </div>

        <div style={{ marginTop: 12 }} className="progress">
          <div style={{ width: donePercent + "%" }}></div>
        </div>

        <div className="hr"></div>

        <div className="h2">{current.text}</div>
        <div className="choiceGrid">
          {CHOICES.map(c => (
            <button
              key={c.value}
              className={"choice" + ((answers[current.key] === c.value) ? " selected" : "")}
              onClick={() => pick(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="hr"></div>
        <div className="row">
          <button className="btn" onClick={back} disabled={step === 0}>Back</button>
          <div className="space"></div>
          <button
            className="btn btnPrimary"
            onClick={submit}
            disabled={Object.keys(answers).length < QUESTIONS.length}
          >
            Get Result
          </button>
        </div>

        <div className="small" style={{ marginTop: 10 }}>
          If you are in immediate danger, do not finish the questionnaire — press SOS now.
        </div>
      </div>
    </div>
  );
}
'@

# 4) App.jsx: add active nav style + floating SOS FAB
# We'll overwrite App.jsx safely to avoid fragile patching.
WriteUtf8NoBom "client\src\App.jsx" @'
import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Feed from "./pages/Feed.jsx";
import Community from "./pages/Community.jsx";
import Therapist from "./pages/Therapist.jsx";
import SOS from "./pages/SOS.jsx";
import Risk from "./pages/Risk.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import { track } from "./services/analytics.js";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page views (optional; safe if analytics exists)
    track("page_view", { path: location.pathname });
  }, [location.pathname]);

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

      {/* Floating SOS - always available */}
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

Write-Host "UI redesign applied." -ForegroundColor Green
Write-Host "Restart client dev server now." -ForegroundColor Cyan
