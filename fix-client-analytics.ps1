$ErrorActionPreference = "Stop"
$ROOT = $PSScriptRoot
if (-not $ROOT) { $ROOT = (Get-Location).Path }

function WriteUtf8NoBom {
  param([string]$Path, [string]$Content)
  $dir = Split-Path -Parent $Path
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function InsertIfMissing {
  param(
    [string]$Path,
    [string]$Needle,
    [string]$InsertAfterContains,
    [string]$InsertText
  )

  $raw = Get-Content $Path -Raw
  if ($raw -match [Regex]::Escape($Needle)) { return }

  $lines = Get-Content $Path
  $out = New-Object System.Collections.Generic.List[string]
  $inserted = $false

  foreach ($line in $lines) {
    $out.Add($line)
    if (-not $inserted -and $line -like "*$InsertAfterContains*") {
      foreach ($l in ($InsertText -split "`r?`n")) { $out.Add($l) }
      $inserted = $true
    }
  }

  if (-not $inserted) {
    foreach ($l in ($InsertText -split "`r?`n")) { $out.Add($l) }
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($Path, $out.ToArray(), $utf8NoBom)
}

# 1) Ensure analytics service exists
$analyticsPath = Join-Path $ROOT "client\src\services\analytics.js"
WriteUtf8NoBom $analyticsPath @'
import { api } from "./api.js";

export async function track(event, meta = {}) {
  try {
    await api.post("/analytics/track", { event, meta });
  } catch {
    // silent
  }
}
'@

# 2) Patch App.jsx without -replace
$appPath = Join-Path $ROOT "client\src\App.jsx"
if (!(Test-Path $appPath)) { throw "Missing: $appPath" }

# Add imports if missing
InsertIfMissing `
  -Path $appPath `
  -Needle 'useLocation' `
  -InsertAfterContains 'from "react-router-dom"' `
  -InsertText ''

# If the router import line doesn't include useLocation, we adjust it by rewriting ONLY that one line safely.
$lines = Get-Content $appPath
for ($i=0; $i -lt $lines.Length; $i++) {
  if ($lines[$i] -match 'import\s+\{\s*Routes,\s*Route,\s*Navigate,\s*Link\s*\}\s+from\s+"react-router-dom";') {
    $lines[$i] = 'import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";'
  }
}
# Ensure useEffect + track imports
$rawNow = ($lines -join "`r`n")
if ($rawNow -notmatch 'import \{ useEffect \} from "react";') {
  $rawNow = $rawNow -replace 'import \{ Routes, Route, Navigate, Link, useLocation \} from "react-router-dom";',
    "import { Routes, Route, Navigate, Link, useLocation } from `"react-router-dom`";`r`nimport { useEffect } from `"react`";"
}
if ($rawNow -notmatch 'import \{ track \} from "\.\/services\/analytics\.js";') {
  $rawNow = $rawNow -replace 'import \{ useEffect \} from "react";',
    "import { useEffect } from `"react`";`r`nimport { track } from `"./services/analytics.js`";"
}

# Add hook inside App() if missing
if ($rawNow -notmatch 'const location = useLocation\(\);') {
  $rawNow = $rawNow -replace 'export default function App\(\)\s*\{',
    "export default function App() {`r`n  const location = useLocation();`r`n  useEffect(() => { track(`"page_view`", { path: location.pathname }); }, [location.pathname]);"
}

WriteUtf8NoBom $appPath $rawNow

Write-Host "Client analytics patch applied OK." -ForegroundColor Green
