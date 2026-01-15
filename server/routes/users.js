import express from "express";
const router = express.Router();

// Stub: return "not authenticated" until you wire JWT middleware on frontend
router.get("/me", (req, res) => {
  res.status(401).json({ ok:false, error:"Not authenticated (wire JWT middleware next)" });
});

export default router;