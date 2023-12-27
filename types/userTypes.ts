import { JwtPayload } from "jsonwebtoken";
import { Document, Model } from "mongoose";

export interface UserSchemaInterface extends Document {
    username: string,
    password: string,
    role: string
}

export interface UserModelInterface extends Model<UserSchemaInterface> {
    comparePasswords(candidatePassword: string, hashedPassword: string): Promise<boolean>;
    tokenSign(data: any): string;
    verifyToken(token: string): JwtPayload | null;
}