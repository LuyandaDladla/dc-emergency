import express from "express";
const router = express.Router();

router.get("/me", (req, res) => {
  res.json({ ok: true, user: { id: "demo", name: "Demo User", province: "Gauteng", avatarUrl: "" } });
});

export default router;