import express from "express";
import { listAds } from "../controllers/adsController.js";

const router = express.Router();
router.get("/", listAds);

export default router;