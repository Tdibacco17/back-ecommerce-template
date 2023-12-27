import jwt, { JwtPayload } from "jsonwebtoken";
import { environment } from "./config";

interface TokenData {
    username: string;
    role: string;
}

export const tokenSign = (data: TokenData): string => {
    if (!environment.JWT_SECRET || !environment.JWT_ALGORITHM || !environment.JWT_EXPIRE) {
        throw new Error("JWT_SECRET, JWT_ALGORITHM or JWT_EXPIRE is missing in the environment configuration");
    }

    const token = jwt.sign(
        { ...data },
        environment.JWT_SECRET,
        {
            algorithm: environment.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: environment.JWT_EXPIRE,
        }
    );

    return token;
};

export const verifyToken = (token: string): JwtPayload | null => {
    if (!environment.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in the environment configuration");
    }

    try {
        const decoded = jwt.verify(token, environment.JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
