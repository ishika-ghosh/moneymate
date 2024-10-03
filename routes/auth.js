import express from "express";
import { createUser } from "../controllers/auth.js";

const router = express.Router();

router.post("/", createUser);
export default router;
