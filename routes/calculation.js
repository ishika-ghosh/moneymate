import express from "express";
import { getExpenseAnalysis } from "../controllers/sharedExpense.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, getExpenseAnalysis);

export default router;
