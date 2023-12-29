import { Document } from "mongoose";

export interface CategorySchemaInterface extends Document {
    name: string,
}
