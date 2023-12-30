import { Document } from "mongoose";
export interface CloudinaryImgInterface {
    public_id: string,
    secure_url: string
}

export interface ProductSchemaInterface extends Document {
    slug: string,
    name: string,
    price: number,
    stock: number,
    oldPrice?: number,
    discount?: number,
    imageData: CloudinaryImgInterface,
    details: {
        imagesData: CloudinaryImgInterface[],
        description: string,// string[],
    },
    categories: string[]//CategoriesFilterInterface[],
}

export interface BodyProductCreateInterface {
    slug: string,
    name: string,
    price: number,
    stock: number,
    oldPrice?: number,
    discount?: number,
    description: string,//string[],
    category: string[]
    //categoria autoasignable
    //image & images viajan en req.files
}