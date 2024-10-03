import express from "express";
import {
  createExpense,
  deleteExpense,
  getAllExpense,
  updateBudgetExpense,
} from "../controllers/sharedExpense.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", auth, getAllExpense);
router.post("/", auth, createExpense);
router.put("/:id", auth, updateBudgetExpense);
router.delete("/:id", auth, deleteExpense);

export default router;
