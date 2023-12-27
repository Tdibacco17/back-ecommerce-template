import { CategorieTitle, CategoriesFilterInterface } from "../types/productTypes"

// Funciones de validación
export const isValidCategorieTitle = (categorieTitle: CategorieTitle): boolean => {
    const allowedCategorieTitles = ["Remera", "Sudadera", "Top", "Ropa deportiva", "Pantalones", "Vestido"];
    return allowedCategorieTitles.includes(categorieTitle);
}

export const isValidCategories = (categories: CategoriesFilterInterface[]): boolean => {
    const allowedCategories = ["all", "tshirt", "sweatshirts", "top", "sportswear", "bottoms", "dresses", "outstanding"];
    return categories.every(category => allowedCategories.includes(category));
}