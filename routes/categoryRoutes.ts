import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createCategory, deleteCategory, getCategories } from "../controllers/categoryController";

export const router = Router();
//crear categoria
router.post("/category", authMiddleware, createCategory);
//traer todas las categorias
router.get("/categories", getCategories);
//eliminar una categoria
router.delete("/category", authMiddleware, deleteCategory);