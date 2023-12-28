import { ProductSchemaInterface } from "../types/productTypes";
import { Schema, model } from "mongoose";

const productSchema = new Schema<ProductSchemaInterface>({
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
    price: {
        type: Number,
        required: [true, "Price is required."],
    },
    stock: {
        type: Number,
        required: [true, "Stock is required."],
    },
    oldPrice: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    imageData: {
        type: Object,
        public_id: {
            type: String,
            required: [true, "Public_id is required."],
        },
        secure_url: {
            type: String,
            required: [true, "Secure_url is required."],
        },
    },
    details: {
        type: Object,
        imagesData: [
            {
                public_id: {
                    type: String,
                    required: [true, "Public_id is required."],
                },
                secure_url: {
                    type: String,
                    required: [true, "Secure_url is required."],
                },
            }
        ],
        description: String//[String],
    },
    categories: {
        type: String,//[String],
        // enum: ["all", "tshirt", "sweatshirts", "top", "sportswear", "bottoms", "dresses", "outstanding"],
        required: [true, "Categories are required."],
    },
}, {
    timestamps: true
});

const Product = model<ProductSchemaInterface>("Product", productSchema);
export default Product;