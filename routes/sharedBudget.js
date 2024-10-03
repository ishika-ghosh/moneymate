import express from "express";
import auth from "../middleware/auth.js";
import {
  createBudget,
  getBudget,
  updateBudget,
} from "../controllers/sharedBudget.js";

const router = express.Router();

router.post("/", auth, createBudget);
router.get("/", auth, getBudget);
router.put("/:id", auth, updateBudget);

export default router;
