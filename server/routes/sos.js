import express from "express";
import { sendSOS } from "../controllers/sosController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", protect, sendSOS);

export default router;