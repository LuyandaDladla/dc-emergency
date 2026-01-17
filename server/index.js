import express from "express";

import usersRoutes from "./routes/users.js";
import cors from "cors";

import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";

import userRoutes from "./routes/users.js";

import communityRoutes from "./routes/community.js";

import riskRoutes from "./routes/risk.js";

import therapistRoutes from "./routes/therapist.js";

import analyticsRoutes from "./routes/analytics.js";

import hotspotsRoutes from "./routes/hotspots.js";
import sosRoutes from "./routes/sos.js";
dotenv.config();


const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, status: "healthy" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, status: "healthy" });
});
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



app.use("/api/community", communityRoutes);



app.use("/api/risk", riskRoutes);



app.use("/api/therapist", therapistRoutes);



app.use("/api/analytics", analyticsRoutes);



app.use("/api/hotspots", hotspotsRoutes);





const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log("Server running on port", PORT));
app.use("/api/users", usersRoutes);
