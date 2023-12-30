import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
    deleteProduct, getProducts, productCreate, updateProductInfo,
    updateProductImageData, addImgToImagesData, removeImgsFromImagesData,
    removeCategoryFromProduct,
} from "../controllers/productController";
import fileUpload from "express-fileupload";

export const router = Router();
//crear producto
router.post("/product", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, productCreate);
//modificar info del producto
router.put("/product/:slug", authMiddleware, updateProductInfo);
//modificar imageData del producto
router.put("/product/imageData/:slug", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, updateProductImageData);
//agregar imagen a imagesData del producto
router.put("/product/add/imagesData/:slug", fileUpload({ useTempFiles: true, tempFileDir: './uploads' }), authMiddleware, addImgToImagesData);
//remover imagenes de imagesData del producto
router.put("/product/remove/imagesData/:slug", authMiddleware, removeImgsFromImagesData);
//remover cateogria del producto
router.put("/product/remove/category/:slug", authMiddleware, removeCategoryFromProduct);
//eliminar producto
router.delete("/product/:slug", authMiddleware, deleteProduct);
//traer todos los productos
router.get("/products", getProducts);