$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding($false)

$ROOT = Split-Path -Parent $PSScriptRoot
$indexPath = Join-Path $ROOT "server\index.js"

if (!(Test-Path $indexPath)) {
  throw "Missing server/index.js"
}

$code = Get-Content $indexPath -Raw

if ($code -notmatch 'app\.get\("/api/hotspots"') {

$insert = @'

/* === HOTSPOTS + STORIES (required by frontend) === */
app.get("/api/hotspots", (req, res) => {
  const province = req.query.province || "National";
  res.json({
    ok: true,
    province,
    hotspots: [
      { id: "h1", name: "Hotspot A", level: "medium" },
      { id: "h2", name: "Hotspot B", level: "high" }
    ]
  });
});

app.get("/api/hotspots/stories", (req, res) => {
  res.json({
    ok: true,
    stories: [
      { id: "s1", title: "Safety update", province: "Gauteng" },
      { id: "s2", title: "Community alert", province: "Limpopo" }
    ]
  });
});

app.get("/debug/routes", (req, res) => {
  const routes = [];
  app._router.stack.forEach(m => {
    if (m.route) {
      routes.push({
        path: m.route.path,
        methods: Object.keys(m.route.methods).join(",")
      });
    }
  });
  res.json({ ok: true, routes });
});

'@

$code = $code -replace '(app\.listen|\nconst\s+PORT)', "$insert`n`n`$1"

[System.IO.File]::WriteAllText($indexPath, $code, $utf8)
Write-Host "Injected hotspots + debug routes" -ForegroundColor Green

} else {
  Write-Host "Hotspots routes already exist" -ForegroundColor Yellow
}

git add server/index.js | Out-Null
git commit -m "Add hotspots and stories endpoints" | Out-Host
git push | Out-Host

Write-Host "Done. Render will redeploy." -ForegroundColor Green
