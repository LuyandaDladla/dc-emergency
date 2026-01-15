import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// CORS (safe, never crashes the server)
const normalizeOrigin = (u) => (u || "").toString().trim().replace(/\/+$/, "");
const allowed = (process.env.CLIENT_ORIGIN || "").split(",").map(normalizeOrigin).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const o = normalizeOrigin(origin);
    if (allowed.length === 0) return cb(null, true);
    if (allowed.includes(o)) return cb(null, true);
    if (o.endsWith(".vercel.app")) return cb(null, true);
    return cb(null, false);
  },
  credentials: true
}));
app.options("*", cors());

// Root + health
app.get("/", (req, res) => res.status(200).json({ ok: true, service: "dc-emergency", status: "up" }));
app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));

// --- REQUIRED ROUTES (match your frontend calls) ---
// GET /api/hotspots?province=Gauteng
app.get("/api/hotspots", (req, res) => {
  const province = req.query.province || "National";
  return res.json({
    ok: true,
    province,
    hotspots: [
      { id: "h1", name: "Hotspot A", level: "medium" },
      { id: "h2", name: "Hotspot B", level: "high" }
    ]
  });
});

// GET /api/hotspots/stories
app.get("/api/hotspots/stories", (req, res) => {
  return res.json({
    ok: true,
    stories: [
      { id: "s1", title: "Safety update", province: "Gauteng", createdAt: new Date().toISOString() },
      { id: "s2", title: "Community alert", province: "Limpopo", createdAt: new Date().toISOString() }
    ]
  });
});

// DEBUG: list registered routes (temporary, remove later)
app.get("/debug/routes", (req, res) => {
  const routes = [];
  const stack = (app._router && app._router.stack) ? app._router.stack : [];
  for (const layer of stack) {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods || {}).join(",").toUpperCase();
      routes.push({ path: layer.route.path, methods });
    }
  }
  res.json({ ok: true, routes });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err && err.message ? err.message : err);
  res.status(500).json({ ok: false, error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));