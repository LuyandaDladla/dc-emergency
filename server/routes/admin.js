import express from "express";
import { stats, sosFeed } from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, stats);
router.get("/sos", protect, adminOnly, sosFeed);

export default router;
