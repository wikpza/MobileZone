import {IIngredientRepository} from "../interface/ingredientRepository.interface";
import {
    AddIngredientType,
    DeleteIngredientType,
    GetIngredientType,
    GetProductIngredientType, UpdateIngredientType
} from "../models/ingredient.model";
import {Ingredient, Product, RawMaterial, Unit} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import sequelize from "../database";
import {Error, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";

export class IngredientRepository implements IIngredientRepository{
    async addIngredient(data: AddIngredientType): Promise<void> {
        try {
            await sequelize.query(
                "EXEC AddIngredient @productId = :productId, @rawMaterialId = :rawMaterialId, @quantity = :quantity",
                {
                    replacements: {
                        rawMaterialId:data.rawMaterialId,
                        productId: data.productId,
                        quantity: data.quantity
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры AddIngredient:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }

    async deleteIngredient(data: DeleteIngredientType): Promise<void> {
        // const ingredientExist = await Ingredient.findOne({ where: { id: data.id } });
        // if (!ingredientExist) throw new NotFoundError('not found raw material', { id: ["not found raw material"] });
        //
        //
        // const deleteIngredient = await Ingredient.destroy({where:{id:data.id}})
        // if(deleteIngredient === 0 ) throw new NotFoundError('not found raw material', { id: ["not found raw material"] });
        //
        // return ingredientExist

        try {
            await sequelize.query(
                "EXEC DeleteIngredient @id = :id",
                {
                    replacements: {
                        id:data.id
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeleteIngredient:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }

    }

    getIngredient(data: GetIngredientType): Promise<Ingredient> {
        return Promise.resolve({} as Ingredient);
    }

    async getProductIngredient(data: GetProductIngredientType): Promise<Ingredient[]> {
        const productExist = await Product.findOne({ where: { id: data.id } });
        if (!productExist) throw new NotFoundError('not found product', { id: ["not found product"] });

        const productIngredients = await Ingredient.findAll({
            where: { productId: data.id },
            include: [
                {
                    model: RawMaterial,
                    attributes: ["id", "name", "unitId", 'cost', 'quantity'],
                    include: [
                        {
                            model: Unit,
                            attributes: ["id", "name"],
                        }
                    ]
                }
            ]
        });

        return productIngredients;
    }

    async updateIngredient(data: UpdateIngredientType): Promise<void> {
        // const ingredientExist = await Ingredient.findOne({ where: { id: data.id } });
        // if (!ingredientExist) throw new NotFoundError('not found raw material', { id: ["not found raw material"] });
        //
        //
        // const [updateIngredient] = await Ingredient.update({quantity:data.quantity},{where:{id:data.id}})
        // if(updateIngredient === 0 ) throw new NotFoundError('not found raw material', { id: ["not found raw material"] });
        //
        // return ingredientExist

        try {
            await sequelize.query(
                "EXEC UpdateIngredient @id = :id, @quantity = :quantity",
                {
                    replacements: {
                        id:data.id,
                        quantity: data.quantity
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateIngredient:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }

}