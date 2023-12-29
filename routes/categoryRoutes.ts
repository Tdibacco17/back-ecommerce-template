import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createCategory, getCategories } from "../controllers/categoryController";

export const router = Router();

router.post("/category", authMiddleware, createCategory);
router.get("/categories", authMiddleware, getCategories);