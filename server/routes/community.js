import express from "express";
const router = express.Router();

// Simple working endpoints (upgrade later)
router.get("/posts", async (req, res) => {
  res.json({ ok: true, posts: [] });
});

router.post("/posts", async (req, res) => {
  const { text = "", scope = "national", province = "" } = req.body || {};
  if (!text) return res.status(400).json({ ok: false, error: "text required" });
  res.json({ ok: true, post: { id: "temp", text, scope, province, createdAt: new Date().toISOString() } });
});

export default router;