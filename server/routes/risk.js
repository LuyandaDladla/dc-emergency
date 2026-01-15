import express from "express";
import { assessRisk, myLatest, adminSummary } from "../controllers/riskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assess", protect, assessRisk);
router.get("/me/latest", protect, myLatest);
router.get("/admin/summary", protect, adminOnly, adminSummary);

export default router;