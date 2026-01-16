import express from "express";

import sosRoutes from "./routes/sos.js";
import cors from "cors";

import sosRoutes from "./routes/sos.js";
import dotenv from "dotenv";

import sosRoutes from "./routes/sos.js";
import connectDB from "./config/db.js";


import sosRoutes from "./routes/sos.js";
import authRoutes from "./routes/auth.js";

import sosRoutes from "./routes/sos.js";
import userRoutes from "./routes/users.js";

import sosRoutes from "./routes/sos.js";
import communityRoutes from "./routes/community.js";

import sosRoutes from "./routes/sos.js";
import riskRoutes from "./routes/risk.js";

import sosRoutes from "./routes/sos.js";
import therapistRoutes from "./routes/therapist.js";

import sosRoutes from "./routes/sos.js";
import analyticsRoutes from "./routes/analytics.js";

import sosRoutes from "./routes/sos.js";
import hotspotsRoutes from "./routes/hotspots.js";


import sosRoutes from "./routes/sos.js";
dotenv.config();

const app = express();
app.use(express.json());

// CORS: allow localhost + your Vercel domain + previews
const allowed = [
  "http://localhost:5173",
  "https://dc-emergency.vercel.app"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowed.includes(origin)) return cb(null, true);
    if (origin.endsWith(".vercel.app")) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));
app.options("*", cors());

// Always available
app.get("/", (req,res)=>res.json({ ok:true, service:"dc-emergency-backend" }));
app.get("/health", (req,res)=>res.json({ ok:true, status:"healthy" }));
app.get("/debug/boot", (req,res)=>res.json({ ok:true, at:new Date().toISOString() }));

// DB (does not crash in stub mode)
connectDB();

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/users", userRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/community", communityRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/risk", riskRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/therapist", therapistRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use("/api/sos", sosRoutes);
app.use("/api/hotspots", hotspotsRoutes);


app.use("/api/sos", sosRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server running on port", PORT));