import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import sosRoutes from "./routes/sos.js";
import hotspotsRoutes from "./routes/hotspots.js";
import communityRoutes from "./routes/community.js";
import riskRoutes from "./routes/risk.js";
import therapistRoutes from "./routes/therapist.js";
import analyticsRoutes from "./routes/analytics.js";

import chatRoutes from "./routes/chat.js";
import { initSocket } from "./socket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS (Render + localhost + Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN, // optionally set in Render
  "https://dc-emergency.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser calls (curl/postman)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
  })
);

app.options("*", cors());
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/health", (req, res) => res.status(200).json({ ok: true, status: "healthy" }));
app.get("/api/_build", (req, res) =>
  res.json({ ok: true, time: new Date().toISOString(), sha: process.env.RENDER_GIT_COMMIT || "" })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/hotspots", hotspotsRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chat", chatRoutes);

// DB then start server + socket
const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGO_URI);

initSocket(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

server.listen(PORT, () => console.log("Server running on port " + PORT));
