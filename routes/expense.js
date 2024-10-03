import express from "express";
import {
    createExpense,
    getAllExpense,
    updateExpense,
    deleteExpense,
} from "../controllers/expense.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAllExpense);
router.post("/", auth, createExpense);
router.put("/:id", auth, updateExpense);
router.delete("/:id", auth, deleteExpense);

export default router;
