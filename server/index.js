import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import communityRoutes from "./routes/community.js";


import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import riskRoutes from "./routes/risk.js";
import therapistRoutes from "./routes/therapist.js";
import analyticsRoutes from "./routes/analytics.js";

dotenv.config();

const app = express();

/* -------------------- CORE MIDDLEWARE -------------------- */
app.use(express.json());
app.use("/api/community", communityRoutes);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dc-emergency.vercel.app"
    ],
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true
  })
);

/* -------------------- DATABASE -------------------- */
connectDB();

/* -------------------- HEALTH -------------------- */
app.get("/", (req, res) => {
  res.json({ ok: true, service: "dc-emergency-backend" });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

/* -------------------- API ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/analytics", analyticsRoutes);

/* -------------------- START SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});