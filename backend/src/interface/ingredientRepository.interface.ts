
import {Ingredient} from "../database/models";
import {
    AddIngredientType,
    DeleteIngredientType, GetIngredientType,
    GetProductIngredientType,
    UpdateIngredientType
} from "../models/ingredient.model";

export interface IIngredientRepository {
    addIngredient(data:AddIngredientType):Promise<void>
    updateIngredient(data:UpdateIngredientType):Promise<void>
    deleteIngredient(data:DeleteIngredientType):Promise<void>
    getProductIngredient(data:GetProductIngredientType):Promise<Ingredient[]>
    getIngredient(data:GetIngredientType):Promise<Ingredient>
}
