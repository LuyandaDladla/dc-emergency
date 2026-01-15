import express from "express";
import { listProvinces, getProvince } from "../controllers/provinceController.js";

const router = express.Router();
router.get("/", listProvinces);
router.get("/:name", getProvince);

export default router;