import express from "express";
const router = express.Router();

// Stories feed (national/province)
router.get("/stories", (req, res) => {
  res.json({
    ok: true,
    stories: [
      { id: "s1", title: "Safety update", province: "Gauteng", createdAt: new Date().toISOString() },
      { id: "s2", title: "Community alert", province: "Limpopo", createdAt: new Date().toISOString() }
    ]
  });
});

router.get("/province/:province", (req, res) => {
  res.json({
    ok: true,
    province: req.params.province,
    hotspots: [
      { id: "h1", name: "Hotspot A", level: "medium" },
      { id: "h2", name: "Hotspot B", level: "high" }
    ]
  });
});

export default router;