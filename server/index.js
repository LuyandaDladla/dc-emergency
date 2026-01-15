import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// -------------------- CORS (safe + vercel-friendly) --------------------
const normalizeOrigin = (u) => {
  if (!u || typeof u !== "string") return "";
  return u.trim().replace(/\/+$/, "");
};

const allowed = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(normalizeOrigin)
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // curl / server-to-server
    const o = normalizeOrigin(origin);

    // If not set, allow all (dev-friendly)
    if (allowed.length === 0) return cb(null, true);

    if (allowed.includes(o)) return cb(null, true);

    // allow vercel previews
    if (o.endsWith(".vercel.app")) return cb(null, true);

    // do NOT throw (prevents 500 + missing headers)
    return cb(null, false);
  },
  credentials: true
}));

app.options("*", cors());

// -------------------- Health routes --------------------
app.get("/", (req, res) => res.status(200).json({ ok: true, service: "dc-emergency", status: "up" }));
app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));

// -------------------- Route imports (if they exist) --------------------
let authRoutes, userRoutes, hotspotRoutes, therapistRoutes, analyticsRoutes;

try { authRoutes = (await import("./routes/auth.js")).default; } catch(e) {}
try { userRoutes = (await import("./routes/users.js")).default; } catch(e) {}
try { hotspotRoutes = (await import("./routes/hotspots.js")).default; } catch(e) {}
try { therapistRoutes = (await import("./routes/therapist.js")).default; } catch(e) {}
try { analyticsRoutes = (await import("./routes/analytics.js")).default; } catch(e) {}

if (authRoutes) app.use("/api/auth", authRoutes);
if (userRoutes) app.use("/api/users", userRoutes);
if (hotspotRoutes) app.use("/api/hotspots", hotspotRoutes);
if (therapistRoutes) app.use("/api/therapist", therapistRoutes);
if (analyticsRoutes) app.use("/api/analytics", analyticsRoutes);

// -------------------- Error handler --------------------
app.use((err, req, res, next) => {
  console.error("Server error:", err && err.message ? err.message : err);
  res.status(500).json({ ok: false, error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));