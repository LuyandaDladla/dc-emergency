import express from "express";
import { trackEvent, adminStats } from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/track", protect, trackEvent);
router.get("/admin", protect, adminOnly, adminStats);

export default router;