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

export const deleteProduct = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { id } = req.params
    try {
        const productsFoundAndDelete = await Product.findByIdAndDelete(id)

        if (!productsFoundAndDelete) {
            return res.status(404).json({
                message: "Product does not exists.",
                status: 404
            });
        }
        //@ts-ignore
        await deleteImage(productsFoundAndDelete.imageData.public_id);
        //@ts-ignore
        if (productsFoundAndDelete.details.imagesData.length > 0) {
            //@ts-ignore
            for (const image of productsFoundAndDelete.details.imagesData) {
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