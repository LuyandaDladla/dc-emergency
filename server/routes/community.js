import express from "express";
const router = express.Router();

// In-memory posts for now; replace with Mongo later
const posts = []; // {id,text,scope,province,createdAt}

router.get("/posts", (req, res) => {
  const scope = (req.query.scope || "national").toString();
  const province = (req.query.province || "").toString();
  const filtered = posts.filter(p => {
    if (scope === "national") return p.scope === "national";
    if (scope === "province") return p.scope === "province" && p.province.toLowerCase() === province.toLowerCase();
    return true;
  });
  res.json({ ok:true, posts: filtered.slice(-100).reverse() });
});

router.post("/posts", (req, res) => {
  const { text = "", scope = "national", province = "" } = req.body || {};
  if (!text) return res.status(400).json({ ok:false, error:"text required" });

  const post = { id: "p_" + Date.now(), text, scope, province, createdAt: new Date().toISOString() };
  posts.push(post);
  res.json({ ok:true, post });
});

export default router;