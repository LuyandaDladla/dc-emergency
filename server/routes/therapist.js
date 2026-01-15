import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", protect, async (req, res) => {
  const { message } = req.body || {};
  if (!message) return res.status(400).json({ ok:false, error:"message required" });

  const key = process.env.GEMINI_API_KEY || "";
  if (!key) {
    return res.json({ ok:true, reply: "AI is not configured yet. Add GEMINI_API_KEY in Render env vars." });
  }

  // Minimal REST call (server-side). Safe: key never goes to client.
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key;

  const body = {
    contents: [{ parts: [{ text: "You are a calm, supportive therapist-like assistant. Keep it safe and practical.\nUser: " + message }] }]
  };

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await r.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a response right now.";
    res.json({ ok:true, reply });
  } catch (e) {
    res.json({ ok:true, reply: "AI temporarily unavailable." });
  }
});

export default router;