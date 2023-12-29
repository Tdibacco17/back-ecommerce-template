import { Schema, model } from "mongoose";
import { CategorySchemaInterface } from "../types/categoryTypes";

const categorySchema = new Schema<CategorySchemaInterface>({
    name: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
    }
}, {
    timestamps: true
});

const Category = model<CategorySchemaInterface>("Category", categorySchema);
export default Category;