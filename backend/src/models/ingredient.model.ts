import {extensions} from "sequelize/types/utils/validator-extras";

export type DeleteIngredientType = {
    id:number
}
export type GetIngredientType = DeleteIngredientType
export type GetProductIngredientType = DeleteIngredientType
export type AddIngredientType = {
    productId:number,
    rawMaterialId:number,
    quantity:number,
}

export type UpdateIngredientType = {
    id:number,
    quantity:number,
}