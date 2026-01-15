import express from "express";
const router = express.Router();

// Temporary safe defaults (replace with real data later)
router.get("/", (req, res) => {
  const province = (req.query.province || "National").toString();
  res.json({ ok:true, province, hotspots: [] });
});

router.get("/stories", (req, res) => {
  res.json({ ok:true, stories: [] });
});

export default router;