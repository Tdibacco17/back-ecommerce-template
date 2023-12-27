import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { productCreate } from "../controllers/productController";

export const router = Router();

router.post("/product", authMiddleware, productCreate);