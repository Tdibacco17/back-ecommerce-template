import { Request, Response } from "express";
import Product from "../models/product";
import { BodyProductCreateInterface, ProductSchemaInterface } from "../types/productTypes";
import { handleImageUpload, isValidCategories } from "../utils/validateFunctions";
import { ParseResponseInterface } from "../types";
import { UploadedFile } from "express-fileupload";
import { deleteImage, uploadImage, uploadMultipleImages } from "../conn/cloudinary";
import fs from 'fs-extra';

export const productCreate = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug, name, price, oldPrice, discount, stock, categories, description } = req.body as BodyProductCreateInterface;

    try {
        if (!slug || !name || !price || !stock || !req.files || !categories || categories.length === 0) {
            return res.status(400).json({ message: "Missing data required.", status: 400 });
        }
        //agarro las imagenes
        const { imageData, imagesData } = req.files
        if (!imageData) {
            return res.status(400).json({ message: "ImageData required.", status: 400 });
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
        const { cloudImageData, cloudImagesData } = await handleImageUpload((imageData as UploadedFile | undefined), (imagesData as UploadedFile[] | UploadedFile | undefined));

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
        return res.status(500).json({ message: `Catch error in updateProductInfo: ${error}`, status: 500 });
    }
}

export const updateProductImageData = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug } = req.params

    try {
        //si no viene slug corto
        if (!slug) {
            return res.status(400).json({ message: "Slug required.", status: 400 });
        }
        //si no viene slug un archivo corto
        if (!req.files) {
            return res.status(400).json({ message: "File required.", status: 400 });
        }
        const { imageData } = req.files
        //si no viene imagen corto
        if (!imageData) {
            return res.status(400).json({ message: "ImageData required.", status: 400 });
        }
        const productFound = await Product.findOne({ slug });
        //si no existe el producto corto
        if (!productFound) {
            await fs.emptyDir('./uploads');
            return res.status(404).json({ message: "Product does not exist.", status: 404 });
        }
        //elimino primer imagen
        await deleteImage(productFound.imageData.public_id);
        //creo nueva imagen y la subo a cloud
        const cloudImageData = await uploadImage((imageData as UploadedFile).tempFilePath);
        //piso el valor de la imagen del producto con la nueva
        productFound.imageData = cloudImageData;
        //arreglo de imagenes en details.imagesData del producto
        const imagesDataArray = productFound.details.imagesData;
        //elimino la primera imagen del arreglo
        imagesDataArray.shift()
        // Agregar la nueva imagen al principio del arreglo
        imagesDataArray.unshift({
            public_id: cloudImageData.public_id,
            secure_url: cloudImageData.secure_url,
        });
        //guardo
        await productFound.save();
        //borro archivos generados en /uploads
        await fs.emptyDir('./uploads');
        return res.status(200).json({
            message: "First Image update successfully.",
            data: productFound,
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in updateProductFirstImg: ${error}`, status: 500 });
    }
}

export const addImgToImagesData = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug } = req.params

    try {
        //si no viene slug corto
        if (!slug) {
            return res.status(400).json({ message: "Slug required.", status: 400 });
        }
        //si no viene slug un archivo corto
        if (!req.files) {
            return res.status(400).json({ message: "File required.", status: 400 });
        }
        const { imagesData } = req.files
        //si no viene imagen corto
        if (!imagesData) {
            return res.status(400).json({ message: "imagesData required.", status: 400 });
        }
        const productFound = await Product.findOne({ slug });
        //si no existe el producto corto
        if (!productFound) {
            await fs.emptyDir('./uploads');
            return res.status(404).json({ message: "Product does not exist.", status: 404 });
        }

        let cloudImageData;
        //verifico si viene mas de una
        if (Array.isArray(imagesData)) {
            cloudImageData = await uploadMultipleImages(imagesData.map((img) => img.tempFilePath));
        } else {
            cloudImageData = await uploadImage((imagesData as UploadedFile).tempFilePath);
        }

        // Actualizar el producto en la base de datos
        const productFoundAndUpdate = await Product.findOneAndUpdate(
            { slug },
            {
                $addToSet: {
                    'details.imagesData': Array.isArray(imagesData)
                        ? { $each: cloudImageData }
                        : cloudImageData,
                },
            },
            { new: true }
        );

        await fs.emptyDir('./uploads');
        if (!productFoundAndUpdate) {
            await fs.emptyDir('./uploads');
            return res.status(404).json({ message: "Update error.", status: 404 });
        }
        return res.status(200).json({
            data: productFoundAndUpdate,
            message: "Products found satisfactorily",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in addImgToImagesData: ${error}`, status: 500 });
    }
}

export const removeImgsFromImagesData = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { slug } = req.params

    try {
        if (!slug) {
            return res.status(400).json({ message: "Slug required.", status: 400 });
        }
        const productFound = await Product.findOne({ slug })

        if (!productFound) {
            return res.status(404).json({
                message: "Product does not exists.",
                status: 404
            });
        }

        // Verificar si hay más de una imagen en el arreglo
        if (productFound.details.imagesData.length > 1) {
            // Obtener todas las imágenes después de la primera
            const imagesToRemove = productFound.details.imagesData.slice(1);
            // Eliminar cada imagen de Cloudinary
            for (const image of imagesToRemove) {
                if (image.public_id) {
                    await deleteImage(image.public_id);
                }
            }
            // Mantener solo la primera imagen en el arreglo
            const updatedImagesData = [productFound.details.imagesData[0]];
            // Actualizar el producto en la base de datos usando findOneAndUpdate
            const productFoundAndUpdate = await Product.findOneAndUpdate(
                { slug },
                {
                    $set: {
                        'details.imagesData': updatedImagesData,
                    },
                },
                { new: true }
            );
            return res.status(200).json({
                message: "ImagesData successfully removed.",
                data: productFoundAndUpdate,
                status: 200,
            });
        } else {
            return res.status(200).json({
                message: "No images to remove.",
                data: productFound,
                status: 200,
            });
        }
    } catch (error) {
        return res.status(500).json({ message: `Catch error in deleteImgsFromImagesData: ${error}`, status: 500 });
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