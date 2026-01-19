import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

// keep other routes if they exist in repo
import postsRoutes from "./routes/posts.js";
import sosRoutes from "./routes/sos.js";
import aiRoutes from "./routes/ai.js";
import riskRoutes from "./routes/risk.js";
import therapistRoutes from "./routes/therapist.js";
import hotspotsRoutes from "./routes/hotspots.js";
import adsRoutes from "./routes/ads.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import provincesRoutes from "./routes/provinces.js";

dotenv.config();

const app = express();

const allowlist = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://dc-emergency.vercel.app",
    "https://dc-emergency.vercel.app/",
];

const corsOptions = {
    origin(origin, cb) {
        // allow server-to-server / curl / postman (no origin)
        if (!origin) return cb(null, true);
        if (allowlist.includes(origin)) return cb(null, true);
        return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.use("/api/posts", postsRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/hotspots", hotspotsRoutes);
app.use("/api/ads", adsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provinces", provincesRoutes);

const PORT = process.env.PORT || 10000;

await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log("Server running on port " + PORT));
