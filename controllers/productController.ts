import { Request, Response } from "express";
import Product from "../models/product";
import { ProductSchemaInterface } from "../types/productTypes";
import { isValidCategorieTitle, isValidCategories } from "../utils/validateFunctions";

export const productCreate = async (req: Request, res: Response) => {
    const {
        slug, name, categorieTitle, price,
        cloudinaryUrl, isNewIn, details, categories,
        oldPrice, discount
    } = req.body as ProductSchemaInterface;

    try {
        if (!slug || !name || !categorieTitle || !price || !cloudinaryUrl || !isNewIn || !details || (!categories || categories.length === 0)) {
            return res.status(400).json({ error: "Missing data required." });
        }
        //validar si existe un producto
        const productFound = await Product.findOne({ slug })
        if (productFound) {
            return res.status(400).json({ error: "Product exist." });
        }
        //validar categoria y categoria title
        if (!isValidCategories(categories) || !isValidCategorieTitle(categorieTitle)) {
            return res.status(400).json({ error: "Invalid categories or categorieTitle" });
        }
        //crear producto
        const newProduct: ProductSchemaInterface = await Product.create({
            slug,
            name,
            categorieTitle,
            price,
            cloudinaryUrl,
            isNewIn,
            details,
            categories,
            oldPrice,
            discount
        });
        const savedProduct = await newProduct.save();
        return res.status(200).json({
            message: "Successfully registered user",
            product: savedProduct,
        });
    } catch (error) {
        return res.status(500).json({ error: `Catch error in createUser: ${error}` });
    }
}