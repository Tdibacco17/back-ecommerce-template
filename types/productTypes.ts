import { Document } from "mongoose";

export interface ProductSchemaInterface extends Document {
    slug: string,
    name: string,
    categorieTitle: CategorieTitle,
    price: number,
    oldPrice?: number,
    discount?: number,
    cloudinaryUrl: string,
    isNewIn: boolean,
    details: {
        imagesData: string[],
        description: string[],
    },
    categories: CategoriesFilterInterface[]
}

export interface BodyProductSchemaInterface extends ProductSchemaInterface {
    token: string
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

export type CategorieTitle = "Remera" | "Sudadera" | "Top" | "Ropa deportiva" | "Pantalones" | "Vestido"