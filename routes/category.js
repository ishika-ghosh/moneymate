import express from "express";
import {
    getAllCategory,
    createCategory,
    updateCategory,
} from "../controllers/category.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.get("/", auth, getAllCategory);
router.post("/", auth, createCategory);
router.put("/:id", auth, updateCategory);

export default router;
