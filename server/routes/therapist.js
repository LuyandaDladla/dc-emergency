import express from "express";
import { sendMessage, history, adminCounts } from "../controllers/therapistController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/history", protect, history);
router.post("/message", protect, sendMessage);
router.get("/admin/counts", protect, adminOnly, adminCounts);

export default router;