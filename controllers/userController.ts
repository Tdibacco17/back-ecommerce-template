import { Request, Response } from "express";
import User from "../models/user";
import { UserSchemaInterface } from "../types/userTypes";
import { AuthResponseInterface, ParseResponseInterface } from "../types";

export const createUser = async (req: Request, res: Response<ParseResponseInterface>) => {
    // try {
    //     const { username, password, role } = req.body as UserSchemaInterface;
    //     //validar si faltan datos
    //     if (!username || !password) {
    //         return res.status(400).json({ message: "Username or Password required.", status: 400 });
    //     }
    //     //validar si existe un usario con dicho role
    //     const existingUser = await User.findOne({ username });
    //     if (existingUser) {
    //         return res.status(400).json({ message: "User exist.", status: 404 });
    //     }
    //     //crear usuario
    //     const user: UserSchemaInterface = new User({
    //         username,
    //         password,
    //         role
    //     })
    //     await user.save()
    //     return res.status(200).json({ message: "Successfully registered user", status: 200 });
    // } catch (error) {
    //     return res.status(500).json({ message: `Catch error in createUser: ${error}`, status: 500 });
    // }
    return res.status(200).json({ message: "Unauthorized", status: 401 });
};

export const loginUser = async (req: Request, res: Response<AuthResponseInterface>) => {
    try {
        const { username, password } = req.body as UserSchemaInterface;
        //validar si faltan datos
        if (!username || !password) {
            return res.status(400).json({ message: "Username or Password required.", status: 400 });
        }
        //buscar usuario
        const userFound = await User.findOne({ username }).select("+password")
        if (!userFound) {
            return res.status(400).json({ message: "User not found", status: 404 });
        }
        //comparar contraseña
        const passwordMatch = await User.comparePasswords(password, userFound.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid credentials", status: 400 });
        }
        //generar token con el metodo
        const token = User.tokenSign({
            username: userFound.username,
        })
        return res.status(200).json({
            role: userFound?.role,
            token,
            message: "User found successfully.",
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in loginUser: ${error}`, status: 500 });
    }
};