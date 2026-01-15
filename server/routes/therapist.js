import express from "express";
const router = express.Router();

router.get("/history", (req, res) => {
  res.json({ ok: true, messages: [] });
});

router.post("/message", (req, res) => {
  const text = (req.body && req.body.text) ? req.body.text : "";
  res.json({
    ok: true,
    reply: "I hear you. You are not alone. If you are in immediate danger, use SOS now.",
    echo: text
  });
});

export default router;