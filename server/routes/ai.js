import express from "express";
import { therapy } from "../controllers/aiController.js";

const router = express.Router();

router.post("/therapy", therapy);

export default router;
