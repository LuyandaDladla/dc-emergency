import express from "express";
import usersRouter from "./users.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// Alias common auth endpoints so the frontend stops trying random URLs.
// If your real login/register endpoints live under /api/users,
// this will make /api/auth/login and /api/auth/register work too.

router.post("/login", (req, res, next) => usersRouter.handle(req, res, next));
router.post("/register", (req, res, next) => usersRouter.handle(req, res, next));

export default router;