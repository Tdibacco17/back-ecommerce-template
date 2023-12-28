import { Request, Response } from "express";
import Product from "../models/product";
import { BodyProductCreateInterface, ProductSchemaInterface } from "../types/productTypes";
import { handleImageUpload, isValidCategories } from "../utils/validateFunctions";
import { ParseResponseInterface } from "../types";
import { UploadedFile } from "express-fileupload";
import { deleteImage } from "../conn/cloudinary";
import fs from 'fs-extra';

export const productCreate = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug, name, price, oldPrice, discount, stock, categories, description } = req.body as BodyProductCreateInterface;

    try {
        if (!slug || !name || !price || !stock || !req.files || !categories || categories.length === 0) {
            return res.status(400).json({ message: "Missing data required.", status: 400 });
        }
        //agarro las imagenes
        const { image, images } = req.files
        if (!image) {
            return res.status(400).json({ message: "Image data required.", status: 400 });
        }
        //validar si existe un producto
        const productFound = await Product.findOne({ slug })
        if (productFound) {
            //eliminar archivos de /uploads si es que el producto ya existe
            await fs.emptyDir('./uploads');
            return res.status(404).json({ message: "Product exist.", status: 404 });
        }
        //validar categoria y categoria title
        if (!isValidCategories([categories])) {
            return res.status(400).json({ message: "Invalid categories or categorieTitle", status: 400 });
        }

        //subir imagen a cloudinary
        const { cloudImageData, cloudImagesData } = await handleImageUpload((image as UploadedFile | undefined), (images as UploadedFile[] | UploadedFile | undefined));

        //crear producto
        const newProduct: ProductSchemaInterface = await Product.create({
            slug,
            name,
            price,
            stock,
            imageData: cloudImageData,
            details: {
                imagesData: cloudImagesData,
                description: description
            },
            categories,
            oldPrice,
            discount
        });
        const savedProduct = await newProduct.save();
        //eliminar archivos de /uploads luego de subir el producto a la db
        await fs.emptyDir('./uploads');

        return res.status(200).json({
            message: "Successfully registered user",
            data: savedProduct,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in createProduct: ${error}`, status: 500 });
    }
}

export const getProducts = async (req: Request, res: Response<ParseResponseInterface>) => {
    try {
        const productsFound = await Product.find()

        return res.status(200).json({
            data: productsFound,
            message: "Products found satisfactorily",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in getProducts: ${error}`, status: 500 });
    }
}

export const updateProductInfo = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug } = req.params
    const { name, price, oldPrice, discount, stock, categories, description } = req.body as BodyProductCreateInterface;
    try {
        if (!slug) {
            return res.status(400).json({ message: "Slug required.", status: 400 });
        }
        const updateFields: any = {};
        if (name && name.length > 0) {
            updateFields["name"] = name
        }
        if (price && price > 0) {
            updateFields["price"] = price
        }
        if (oldPrice && oldPrice > 0) {
            updateFields["price"] = oldPrice
        }
        if (discount && discount >= 0) {
            updateFields["discount"] = discount
        }
        if (stock && stock >= 0) {
            updateFields["stock"] = stock
        }
        //terminar de crear bien el arreglo
        if (categories && categories.length > 0) {
            updateFields["categories"] = categories
        }
        //terminar de crear bien el arreglo
        if (description && description.length > 0) {
            updateFields["details.description"] = description; 
        }
        const productFound = await Product.findOneAndUpdate({ slug }, updateFields, { new: true });
        if (!productFound) {
            return res.status(404).json({ message: "Product does not exist.", status: 404 });
        }
        return res.status(200).json({
            message: "Product successfully removed.",
            data: productFound,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in updateProduct: ${error}`, status: 500 });
    }
}

export const deleteProduct = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug } = req.params
    try {
        if (!slug) {
            return res.status(400).json({ message: "Slug required.", status: 400 });
        }

        const productFound = await Product.findOneAndDelete({ slug })

        if (!productFound) {
            return res.status(404).json({
                message: "Product does not exists.",
                status: 404
            });
        }
        await deleteImage(productFound.imageData.public_id);
        if (productFound.details.imagesData.length > 0) {
            for (const image of productFound.details.imagesData) {
                if (image.public_id) {
                    await deleteImage(image.public_id);
                }
            }
        }

        return res.status(200).json({
            message: "Product successfully removed.",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in deleteProduct: ${error}`, status: 500 });
    }
}