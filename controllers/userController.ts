import { Request, Response } from "express";
import User from "../models/user";
import { UserSchemaInterface } from "../types/userTypes";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, roll } = req.body as UserSchemaInterface;
        //validar si faltan datos
        if (!username || !password) {
            return res.status(400).json({ error: "Username or Password required.", });
        }
        //validar si existe un usario con dicho roll
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User exist." });
        }
        //crear usuario
        const user: UserSchemaInterface = new User({
            username,
            password,
            roll
        })
        await user.save()
        return res.status(200).json({ message: "Successfully registered user" });
    } catch (error) {
        return res.status(500).json({ error: `Catch error in createUser: ${error}` });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as UserSchemaInterface;
        //validar si faltan datos
        if (!username || !password) {
            return res.status(400).json({ error: "Username or Password required.", });
        }
        //buscar usuario
        const userFound = await User.findOne({ username }).select("+password")
        if (!userFound) {
            return res.status(400).json({ error: "User not found" });
        }
        //comparar contraseña
        const passwordMatch = await User.comparePasswords(password, userFound.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = User.tokenSign({
            username: userFound.username,
            role: userFound.roll
        })

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: `Catch error in loginUser: ${error}` });
    }
};