import express from "express";
import auth from "../middleware/auth.js";
const router = express.Router();

// Stub: return "not authenticated" until you wire JWT middleware on frontend

});

export default router;

router.get("/me", auth, async (req, res) => {
  const u = req.user || {};
  return res.json({ ok: true, user: { id: u.id || u._id || null, email: u.email || null, isAdmin: !!u.isAdmin }, raw: u });
});
