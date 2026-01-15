import express from "express";
import { listPosts, createPost, adminVerify } from "../controllers/postsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", listPosts);
router.post("/", protect, createPost);
router.put("/admin/:id/verify", protect, adminOnly, adminVerify);

export default router;