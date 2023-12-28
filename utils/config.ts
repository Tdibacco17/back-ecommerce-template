import dotenv from "dotenv";
import { EnviromentInterface } from "../types/configTypes";
dotenv.config();

export const environment: EnviromentInterface = {
    PORT: process.env["PORT"],
    HOST: process.env["HOST"],
    JWT_SECRET: process.env["JWT_SECRET"],
    JWT_ALGORITHM: process.env["JWT_ALGORITHM"],
    JWT_EXPIRE: process.env["JWT_EXPIRE"],
    MONGODB_URI: process.env["MONGODB_URI"],
    MONGO_USERNAME: process.env["MONGO_USERNAME"],
    MONGO_PASSWORD: process.env["MONGO_PASSWORD"],
    MONGO_COLLECTION: process.env["MONGO_COLLECTION"],
    CLOUDINARY_CLOUD_NAME: process.env["CLOUDINARY_CLOUD_NAME"],
    CLOUDINARY_API_KEY: process.env["CLOUDINARY_API_KEY"],
    CLOUDINARY_API_SECRET: process.env["CLOUDINARY_API_SECRET"]
}