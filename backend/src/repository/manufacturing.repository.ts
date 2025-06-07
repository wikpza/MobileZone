import {IManufacturingInterface} from "../interface/Manufacturing.interface";
import {CreateManufacturingType, GetManufacturingType} from "../models/manufacturing.model";
import {
    BudgetHistory,
    Employee,
    Ingredient,
    Product,
    ProductManufacturing,
    RawMaterial,
    Unit
} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import sequelize from "../database";
import {Error, Op, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";

export class ManufacturingRepository implements IManufacturingInterface{
    async getManufacturingHistory(data: GetManufacturingType): Promise<ProductManufacturing[]> {
        const offset = (data.page - 1) * data.limit;

        const where: any = {};

        // Если переданы ОБЕ даты - ищем между ними
        if (data.beforeDate && data.toDate) {
            where.createdAt = {
                [Op.between]: [data.beforeDate, data.toDate]
            };
        }
        // Если передана только конечная дата (beforeDate)
        else if (data.beforeDate) {
            where.createdAt = {
                [Op.lte]: data.beforeDate
            };
        }
        // Если передана только начальная дата (toDate)
        else if (data.toDate) {
            where.createdAt = {
                [Op.gte]: data.toDate
            };
        }

        console.log("WHERE condition:", JSON.stringify(where, null, 2));

        return await ProductManufacturing.findAll({
            where: Object.keys(where).length ? where : undefined,
            limit: data.limit,
            offset: offset,
            order: [[data.sortBy, "DESC"]],
            include: [
                {
                    model: Employee,
                    attributes: ["id", "firstName", "lastName", "middleName"]
                },
                {
                    model: Product,
                    attributes: ['name'],
                    include: [
                        {
                            model: Unit,
                            attributes: ["id", "name"]
                        }
                    ]
                }
            ]
        });
    }

    async makeProduct(input: CreateManufacturingType): Promise<void> {
        // const productExist = await Product.findOne({where:{id:input.productId}})
        // if(!productExist) throw new NotFoundError('not found product', {productId:['not found product']})
        //
        // const productIngredient = await Ingredient.findAll({where:{productId:productExist.id}})
        // if(productIngredient.length === 0) throw new ConflictError("You haven't add anything manufacturing instructions of product", {quantity:["You haven't add anything manufacturing instructions of product"]})
        //
        // const employeeExist = await Employee.findOne({where:{id:input.employeeId}})
        // if(!employeeExist) throw new NotFoundError('not found user', {id:['not found user']})
        //
        // for (let ingredient of productIngredient){
        //     const rawMaterialExist = await RawMaterial.findOne({where:{id:ingredient.rawMaterialId}})
        //     if(!rawMaterialExist)  throw new ConflictError("You haven't add anything manufacturing instructions of product", {quantity:["You haven't add anything manufacturing instructions of product"]})
        //
        //     if(rawMaterialExist.quantity < (input.quantity*ingredient.quantity)) throw new ConflictError(`You haven't enough ${rawMaterialExist.name } (raw materials) to produce `, {quantity:[`You haven't enough ${rawMaterialExist.name } (raw materials) to produce `]})
        // }
        //
        // let totalCost = 0
        //
        // for (let ingredient of productIngredient){
        //     const rawMaterialExist = await RawMaterial.findOne({where:{id:ingredient.rawMaterialId}})
        //     if(!rawMaterialExist)  throw new ConflictError("You haven't add anything manufacturing instructions of product", {quantity:["You haven't add anything manufacturing instructions of product"]})
        //     const rawMaterialPrice = parseFloat( (rawMaterialExist.cost / rawMaterialExist.quantity * (ingredient.quantity * input.quantity)).toFixed(2) )
        //     totalCost += rawMaterialPrice
        //
        //     rawMaterialExist.cost -= rawMaterialPrice
        //     rawMaterialExist.quantity -= (ingredient.quantity * input.quantity)
        //     await rawMaterialExist.save()
        // }
        //
        // productExist.quantity += input.quantity
        // productExist.cost += totalCost
        // await productExist.save()


        // return await ProductManufacturing.create({productId:productExist.id, quantity:input.quantity, employeeId:employeeExist.id})
        try {
            await sequelize.query(
                "EXEC ProductManufacturing @productId = :productId, @quantity = :quantity, @employeeId = :employeeId",
                {
                    replacements: {
                        productId: input.productId,
                        quantity: input.quantity,
                        employeeId: input.employeeId,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры ProductManufacturing:", error.message);

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

