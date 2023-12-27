import { Request, Response } from "express";
import Product from "../models/product";
import { ProductSchemaInterface } from "../types/productTypes";
import { isValidCategorieTitle, isValidCategories } from "../utils/validateFunctions";
import { ParseResponseInterface } from "../types";

export const productCreate = async (req: Request, res: Response<ParseResponseInterface>) => {
    const {
        slug, name, categorieTitle, price,
        cloudinaryUrl, isNewIn, details, categories,
        oldPrice, discount
    } = req.body as ProductSchemaInterface;

    try {
        if (!slug || !name || !categorieTitle || !price || !cloudinaryUrl || !isNewIn || !details || (!categories || categories.length === 0)) {
            return res.status(400).json({ message: "Missing data required.", status: 400 });
        }
        //validar si existe un producto
        const productFound = await Product.findOne({ slug })
        if (productFound) {
            return res.status(404).json({ message: "Product exist.", status: 404 });
        }
        //validar categoria y categoria title
        if (!isValidCategories(categories) || !isValidCategorieTitle(categorieTitle)) {
            return res.status(400).json({ message: "Invalid categories or categorieTitle", status: 400 });
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
            data: savedProduct,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in createUser: ${error}`, status: 500 });
    }
}

export const getProducts = async (req: Request, res: Response<ParseResponseInterface>) => {
    try {
        const productsData = await Product.find()

        return res.status(200).json({
            data: productsData,
            message: "Products found satisfactorily",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in createUser: ${error}`, status: 500 });
    }
}