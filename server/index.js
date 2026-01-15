import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check (Render)
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, status: "healthy" });
});

// If you already have your server.js routes, load them here:
try {
  const mod = await import("./server.js");
  // If server.js exports nothing, that's fine; it will register routes if coded that way.
} catch (e) {
  console.log("Could not import ./server.js (this is ok if your routes live here):", e.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend listening on", PORT));