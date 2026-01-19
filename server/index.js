import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import sosRoutes from "./routes/sos.js";
import communityRoutes from "./routes/community.js";
import riskRoutes from "./routes/risk.js";
import therapistRoutes from "./routes/therapist.js";
import analyticsRoutes from "./routes/analytics.js";
import hotspotsRoutes from "./routes/hotspots.js";

dotenv.config();

const app = express();

/**
 * CORS (single source of truth)
 * - allows localhost dev
 * - allows all *.vercel.app previews + prod
 * - allows server-to-server (no origin)
 */
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const allowedExact = new Set([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://dc-emergency.vercel.app"
    ]);

    if (allowedExact.has(origin)) return cb(null, true);
    if (origin.endsWith(".vercel.app")) return cb(null, true);

    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"]
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/_build", (req, res) => res.json({ ok: true, sha: process.env.RENDER_GIT_COMMIT || "local", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hotspots", hotspotsRoutes);

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);

app.listen(PORT, () => console.log("Server running on port " + PORT));