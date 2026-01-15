import express from "express";
const router = express.Router();

router.post("/track", (req, res) => {
  res.json({ ok: true });
});

export default router;