import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
    deleteProduct, getProducts, productCreate, updateProductInfo,
    updateProductImageData, addImgToImagesData, removeImgsFromImagesData
} from "../controllers/productController";
import fileUpload from "express-fileupload";

export const router = Router();

router.post("/product", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, productCreate);

router.put("/product/:slug", authMiddleware, updateProductInfo);
router.put("/product/imageData/:slug", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, updateProductImageData);
router.put("/product/add/imagesData/:slug", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, addImgToImagesData);
router.put("/product/remove/imagesData/:slug", authMiddleware, removeImgsFromImagesData);

router.delete("/product/:slug", authMiddleware, deleteProduct);

router.get("/products", getProducts);