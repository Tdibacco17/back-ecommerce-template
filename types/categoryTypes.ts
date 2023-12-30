import { Document } from "mongoose";

export interface CategorySchemaInterface extends Document {
    name: string,
}

//categorias
export type CategoriesFilterInterface =
    "all"
    | "tshirt"
    | "sweatshirts"
    | "dresses"
    | "outstanding";