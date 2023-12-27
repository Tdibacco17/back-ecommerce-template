import { ProductSchemaInterface } from "../types/productTypes";
import { Schema, model } from "mongoose";

const productSchema = new Schema({
    slug: {
        type: String,
        required: [true, "Slug is required."],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Name is required."],
        minlength: 5
    },
    categorieTitle: {
        type: String,
        enum: ["Remera", "Sudadera", "Top", "Ropa deportiva", "Pantalones", "Vestido"],
        required: [true, "Category title is required."],
    },
    price: {
        type: Number,
        required: [true, "Price is required."],
    },
    oldPrice: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    cloudinaryUrl: {
        type: String,
        required: [true, "Cloudinary URL is required."],
    },
    isNewIn: {
        type: Boolean,
        required: [true, "isNewIn flag is required."],
    },
    details: {
        type: {
            imagesData: [String],
            description: [String],
        },
        required: [true, "Details are required."],
    },
    categories: {
        type: [String],
        enum: ["all", "tshirt", "sweatshirts", "top", "sportswear", "bottoms", "dresses", "outstanding"],
        required: [true, "Categories are required."],
    },
});

const Product = model<ProductSchemaInterface>("Product", productSchema);
export default Product;