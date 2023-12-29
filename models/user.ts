import { Schema, model } from "mongoose";
import { UserModelInterface, UserSchemaInterface } from "../types/userTypes";
import { tokenSign, verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs"

const userSchema = new Schema<UserSchemaInterface, UserModelInterface>({
    username: {
        type: String,
        required: [true, "Username is required."],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        required: [true, "Role is required."],
    },
}, {
    timestamps: true
});

userSchema.statics.comparePasswords = async function (
    candidatePassword: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword)
};

userSchema.statics.tokenSign = function (data: any): string {
    return tokenSign(data);
};

userSchema.statics.verifyToken = function (token: string): JwtPayload | null {
    return verifyToken(token);
};

userSchema.pre<UserSchemaInterface>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (err: any) {
        return next(err);
    }
});

const User = model<UserSchemaInterface, UserModelInterface>("User", userSchema);
export default User;