import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";
import usersRoutes from "./routes/users.js";
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
app.use(cors());
app.use(express.json());
app.get("/health",(req,res)=>res.json({ok:true}));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

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

const PORT = process.env.PORT || 5000;

await connectDB(process.env.MONGO_URI);
app.listen(PORT, () => console.log("Server running on port " + PORT));
