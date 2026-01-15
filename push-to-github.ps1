$ErrorActionPreference = "Stop"

# ====== CONFIG (edit if needed) ======
$ProjectPath = "C:\Users\Luyanda\dc-emergency-web"
$RepoUrl     = "https://github.com/LuyandaDladla/dc-emergency.git"
$Branch      = "main"
$CommitMsg   = "Initial DC Emergency Web App"

function Say($m){ Write-Host $m -ForegroundColor Cyan }
function Ok($m){ Write-Host $m -ForegroundColor Green }
function Warn($m){ Write-Host $m -ForegroundColor Yellow }
function Fail($m){ Write-Host $m -ForegroundColor Red }

Say "GitHub Push Script"
Say ("Project: " + $ProjectPath)
Say ("Repo:    " + $RepoUrl)
Write-Host ""

if(!(Test-Path $ProjectPath)){
  Fail "Project folder not found. Edit `$ProjectPath in the script."
  exit 1
}

# Check Git
try { git --version | Out-Null } catch {
  Fail "Git is not installed. Install: https://git-scm.com/download/win"
  exit 1
}

Set-Location $ProjectPath

# Create .gitignore (append if exists)
$gitignorePath = Join-Path $ProjectPath ".gitignore"
$ignoreLines = @(
  "node_modules",
  ".env",
  ".env.*",
  "dist",
  "build",
  ".DS_Store",
  ".vscode",
  "*.log"
)

if(!(Test-Path $gitignorePath)){
  Set-Content -Path $gitignorePath -Value $ignoreLines -Encoding Ascii
  Ok "Created .gitignore"
} else {
  $existing = Get-Content $gitignorePath -ErrorAction SilentlyContinue
  $toAdd = @()
  foreach($l in $ignoreLines){
    if($existing -notcontains $l){ $toAdd += $l }
  }
  if($toAdd.Count -gt 0){
    Add-Content -Path $gitignorePath -Value $toAdd -Encoding Ascii
    Ok "Updated .gitignore (added missing rules)"
  } else {
    Ok ".gitignore already looks good"
  }
}

# Initialize git if not already
if(!(Test-Path (Join-Path $ProjectPath ".git"))){
  Say "Initializing git..."
  git init | Out-Host
  Ok "git init done"
} else {
  Ok "Git repo already initialized"
}

# Ensure branch name
Say ("Setting branch to: " + $Branch)
git branch -M $Branch | Out-Host

# Add files
Say "Staging files..."
git add . | Out-Host
Ok "Files staged"

# Commit (if nothing to commit, continue)
Say "Committing..."
try {
  git commit -m $CommitMsg | Out-Host
  Ok "Commit created"
} catch {
  Warn "Nothing new to commit (or commit failed). Continuing..."
}

# Add or set remote origin
$remotes = git remote | Out-String
if($remotes -match "origin"){
  Say "Origin already exists. Updating origin URL..."
  git remote set-url origin $RepoUrl | Out-Host
} else {
  Say "Adding origin remote..."
  git remote add origin $RepoUrl | Out-Host
}
Ok "Remote origin set"

# Push
Say "Pushing to GitHub..."
Warn "If prompted: username = your GitHub username, password = GitHub Personal Access Token (PAT)"
git push -u origin $Branch | Out-Host

Ok "DONE. Refresh your GitHub repo page to confirm files are uploaded."
Warn "Make sure node_modules and .env are NOT in the repo."
