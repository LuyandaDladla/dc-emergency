import express from "express";
import { sendSOS } from "../controllers/sosController.js";
import { protect, optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post("/", optionalProtect, sendSOS);

export default router;