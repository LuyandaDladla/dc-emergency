import express from "express";
import {
  listHotspots,
  listVerifiedStories,
  adminList,
  adminCreate,
  adminUpdate,
  adminDelete
} from "../controllers/hotspotController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// public (logged-in optional; you can add protect later if you want)
router.get("/", listHotspots);
router.get("/stories", listVerifiedStories);

// admin
router.get("/admin/all", protect, adminOnly, adminList);
router.post("/admin", protect, adminOnly, adminCreate);
router.put("/admin/:id", protect, adminOnly, adminUpdate);
router.delete("/admin/:id", protect, adminOnly, adminDelete);

export default router;