import express from "express";
const router = express.Router();

// Minimal demo auth (replace with real JWT later)
router.post("/login", (req, res) => {
  res.json({ ok: true, token: "demo-token", user: { id: "demo", name: "Demo User", isAdmin: false } });
});

router.post("/register", (req, res) => {
  res.json({ ok: true, token: "demo-token", user: { id: "demo", name: "Demo User", isAdmin: false } });
});

export default router;