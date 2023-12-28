import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteProduct, getProducts, productCreate } from "../controllers/productController";
import fileUpload from "express-fileupload";

export const router = Router();

router.post("/product", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, productCreate);
router.get("/product", authMiddleware, getProducts);
router.delete("/product/:id", authMiddleware, deleteProduct);