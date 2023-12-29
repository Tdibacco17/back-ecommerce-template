import { Request, Response } from "express";
import Category from "../models/category";
import { ParseResponseInterface } from "../types";
import { CategorySchemaInterface } from "../types/categoryTypes";

export const createCategory = async (req: Request, res: Response<ParseResponseInterface>) => {
    const { name } = req.body as CategorySchemaInterface;
    try {
        //validar si faltan datos
        if (!name) {
            return res.status(400).json({ message: "Name required.", status: 400 });
        }
        //validar si existe una categoria
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(404).json({ message: "Category exist.", status: 404 });
        }
        //crear usuario
        const category: CategorySchemaInterface = new Category({ name })
        await category.save()
        return res.status(200).json({
            message: "Category registered successfully.",
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in createCategory: ${error}`, status: 500 });
    }
};

export const getCategories = async (req: Request, res: Response<ParseResponseInterface>) => {
    try {
        const productsFound = await Category.find()

        return res.status(200).json({
            data: productsFound,
            message: "Categories found satisfactorily",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({ message: `Catch error in getCategories: ${error}`, status: 500 });
    }
}