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
    categories: string//CategoriesFilterInterface[],
}

export interface BodyProductCreateInterface {
    slug: string,
    name: string,
    price: number,
    stock: number,
    oldPrice?: number,
    discount?: number,
    description: string,//string[],
    categories: string //CategoriesFilterInterface[],
    //image & images viajan en req.files
}

// categorias
export type CategoriesFilterInterface =
    "all"
    | "tshirt"
    | "sweatshirts"
    | "top"
    | "sportswear"
    | "bottoms"
    | "dresses"
    | "outstanding";