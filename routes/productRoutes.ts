import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { deleteProduct, getProducts, productCreate, updateProductInfo } from "../controllers/productController";
import fileUpload from "express-fileupload";

export const router = Router();

router.post("/product", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, productCreate);
router.put("/productInfo/:slug", authMiddleware, updateProductInfo);
router.delete("/product/:slug", authMiddleware, deleteProduct);
router.get("/products", getProducts);