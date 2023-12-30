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
        trim: true,
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
        description: {
            type: String
            // type: [String],
            // default: [
            //     "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            //     "Sed ut turpis vel mauris malesuada efficitur. Fusce tincidunt risus vel elit tempor, nec vestibulum tortor fringilla.",
            //     "Quisque vehicula, felis in condimentum sodales, justo lectus consectetur libero, id interdum quam justo id ipsum. Nulla facilisi."   
            // ]
        }
    },
    categories: {
        type: [String],
        default: ["all"],
        required: [true, "Categories are required."],
    },
}, {
    timestamps: true
});

const Product = model<ProductSchemaInterface>("Product", productSchema);
export default Product;