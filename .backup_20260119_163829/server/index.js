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

// Optional routes
import postsRoutes from "./routes/posts.js";
import aiRoutes from "./routes/ai.js";
import adsRoutes from "./routes/ads.js";
import adminRoutes from "./routes/admin.js";
import provincesRoutes from "./routes/provinces.js";

dotenv.config();

const app = express();
app.use(express.json());

//CORS (localhost + production) 
const allowList = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean);

const corsOptions = {
  origin(origin, cb) {
    // allow curl/postman or same-origin server calls
    if (!origin) return cb(null, true);
    if (allowList.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//  Health / build stamp
app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/_build", (req, res) => {
  const sha = process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || "local";
  res.json({ ok: true, sha, time: new Date().toISOString() });
});

//  API routes 
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hotspots", hotspotsRoutes);

// Optional
app.use("/api/posts", postsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provinces", provincesRoutes);

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log("Server running on port " + PORT));
