import express from "express";
const router = express.Router();

const events = [];

router.post("/track", (req, res) => {
  const { event = "", props = {} } = req.body || {};
  if (!event) return res.status(400).json({ ok:false, error:"event required" });

  events.push({ id:"e_"+Date.now(), event, props, at:new Date().toISOString() });
  res.json({ ok:true });
});

router.get("/recent", (req,res)=> {
  res.json({ ok:true, events: events.slice(-50).reverse() });
});

export default router;