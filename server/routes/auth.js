import express from "express";
import { register, login, me, addContact } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, me);
router.post("/contacts", protect, addContact);

export default router;
