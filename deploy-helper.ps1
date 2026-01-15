$ErrorActionPreference = "Stop"

function Say($m){ Write-Host $m -ForegroundColor Cyan }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Fail($m){ Write-Host $m -ForegroundColor Red }

$ROOT = $PSScriptRoot
if(-not $ROOT){ $ROOT = (Get-Location).Path }

Say "DC Emergency Web App - Deployment Helper"
Say ("Root: " + $ROOT)
Write-Host ""

Say "1) Checking prerequisites..."
$node = $null; try{ $node = node -v }catch{}
if(-not $node){ Fail "Node.js not found. Install Node LTS: https://nodejs.org/en/download"; exit 1 }
Ok ("Node: " + $node)
$npm = $null; try{ $npm = npm -v }catch{}
if(-not $npm){ Fail "npm not found. Reinstall Node LTS."; exit 1 }
Ok ("npm: " + $npm)
$git = $null; try{ $git = git --version }catch{}
if(-not $git){ Warn "Git not found. Install: https://git-scm.com/download/win" } else { Ok $git }
Write-Host ""

Say "2) Checking project structure..."
$serverPkg = Join-Path $ROOT "server\package.json"
$clientPkg = Join-Path $ROOT "client\package.json"
if(!(Test-Path $serverPkg)){ Fail "Missing server\package.json"; exit 1 } else { Ok "Found server\package.json" }
if(!(Test-Path $clientPkg)){ Fail "Missing client\package.json"; exit 1 } else { Ok "Found client\package.json" }
Write-Host ""

Say "3) Creating SAFE env templates (no secrets)..."
$serverEnv = @"
# server/.env (DO NOT COMMIT)
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DBNAME
JWT_SECRET=CHANGE_ME_TO_LONG_RANDOM
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=PASTE_NEW_ROTATED_KEY_HERE
EMAIL_USER=
EMAIL_PASS=
TWILIO_SID=
TWILIO_TOKEN=
TWILIO_FROM=
"@
$clientEnv = @"
# client/.env (DO NOT COMMIT)
VITE_API_BASE=http://localhost:5000/api
"@
$utf8 = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $ROOT "server\.env.example"), $serverEnv, $utf8)
[System.IO.File]::WriteAllText((Join-Path $ROOT "client\.env.example"), $clientEnv, $utf8)
Ok "Created server\.env.example and client\.env.example"
Write-Host ""

Say "4) Local install + build (recommended)..."
Warn "This will run npm install and npm run build for client."
Start-Sleep -Seconds 1
Push-Location (Join-Path $ROOT "server"); npm install; Pop-Location
Push-Location (Join-Path $ROOT "client"); npm install; npm run build; Pop-Location
Ok "Local build complete."
Write-Host ""

Say "5) Links (manual steps):"
Write-Host "GitHub new repo: https://github.com/new"
Write-Host "Render dashboard: https://dashboard.render.com/"
Write-Host "Vercel new project: https://vercel.com/new"
Write-Host "MongoDB Atlas: https://cloud.mongodb.com/"
Write-Host "Gemini key rotation: https://aistudio.google.com/app/apikey"
Write-Host ""

Say "6) Git commands (after creating the GitHub repo):"
Write-Host ("cd ""{0}""" -f $ROOT)
Write-Host "git init"
Write-Host "git add ."
Write-Host "git commit -m ""initial commit"""
Write-Host "git branch -M main"
Write-Host "git remote add origin PASTE_YOUR_GITHUB_REPO_URL"
Write-Host "git push -u origin main"
Write-Host ""

Say "7) Render setup:"
Write-Host "Create a Web Service from your repo. Root Directory = server"
Write-Host "Build Command = npm install"
Write-Host "Start Command = npm start"
Write-Host "Env vars = MONGO_URI, JWT_SECRET, CLIENT_ORIGIN, GEMINI_API_KEY"
Write-Host ""

Say "8) Vercel setup:"
Write-Host "Create project from repo. Root Directory = client"
Write-Host "Env var VITE_API_BASE = https://YOUR_RENDER_URL/api"
Write-Host ""
Ok "Done. After deploying, send me your Render URL and Vercel URL."
