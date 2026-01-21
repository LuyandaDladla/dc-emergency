// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import sosRoutes from "./routes/sos.js";
import riskRoutes from "./routes/risk.js";
import therapistRoutes from "./routes/therapist.js";
import hotspotsRoutes from "./routes/hotspots.js";
import analyticsRoutes from "./routes/analytics.js";
import communityRoutes from "./routes/community.js";
import locationRoutes from "./routes/location.js";

dotenv.config();

const app = express();

// ---- CORS (IMPORTANT) ----
const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.CLIENT_ORIGIN || null, // set this to your vercel domain for safety
].filter(Boolean);

app.use(
    cors({
        origin: (origin, cb) => {
            // Allow non-browser tools (no Origin header) like Postman/PowerShell
            if (!origin) return cb(null, true);
            if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
            return cb(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
    })
);

// Preflight
app.options("*", cors());

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));

// optional: build marker (helps confirm deploy)
app.get("/api/_build", (req, res) => {
    res.json({
        ok: true,
        sha: process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || "local",
        time: new Date().toISOString(),
    });
});

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use("/api/location", locationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/hotspots", hotspotsRoutes);

app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);

app.listen(PORT, () => console.log("Server running on port " + PORT));
