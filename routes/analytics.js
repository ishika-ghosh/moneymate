import express from "express";
import { getChartData } from "../controllers/analytics.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getChartData);

export default router;
