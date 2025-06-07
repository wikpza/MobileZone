import {IPurchaseRepositoryInterface} from "../interface/PurchaseRepository.interface";
import {GetPurchasesType, MakePurchasesType} from "../models/purchase.model";
import {Budget, BudgetHistory, Employee, RawMaterial, RawMaterialPurchase, Unit} from "../database/models";
import {AuthorizeError, BaseError, ConflictError, NotFoundError} from "../utils/error";
import sequelize from "../database";
import {Error, Op, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";

export class PurchaseRepository implements IPurchaseRepositoryInterface{
    async getPurchases(input: GetPurchasesType): Promise<RawMaterialPurchase[]> {
        const offset = (input.page - 1) * input.limit;

        const where: any = {};

        // Если переданы ОБЕ даты - ищем между ними
        if (input.beforeDate && input.toDate) {
            where.createdAt = {
                [Op.between]: [input.beforeDate, input.toDate]
            };
        }
        // Если передана только конечная дата (beforeDate)
        else if (input.beforeDate) {
            where.createdAt = {
                [Op.lte]: input.beforeDate
            };
        }
        // Если передана только начальная дата (toDate)
        else if (input.toDate) {
            where.createdAt = {
                [Op.gte]: input.toDate
            };
        }

        return await RawMaterialPurchase.findAll(
            {
                where: Object.keys(where).length ? where : undefined,
            limit: input.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[input.sortBy, "DESC"]], // Сортировка (по переданному полю)
                include: [
                    {
                        model: RawMaterial,
                        attributes: ["id", "name", "unitId"],
                        include: [
                            {
                                model: Unit,
                                attributes: ["id", "name"],
                            }
                        ]
                    },
                    {
                        model:Employee,
                        attributes:["id", "firstName", "lastName","middleName"]
                    }
                ]
        }
        );
    }

    async makePurchases(input: MakePurchasesType): Promise<void> {
        // const materialExist = await RawMaterial.findOne({where:{id:input.rawMaterialId}})
        // if(!materialExist) throw new NotFoundError('not found raw material', {materialId:['not found raw material']})
        //
        // const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //     await Budget.create()
        //     throw new ConflictError('Insufficient funds for purchase.', {cost:["Insufficient funds for purchase."]})
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        // }
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        //
        // if(input.cost > budgetExist.amount) throw new ConflictError('Insufficient funds for purchase.', {cost:["Insufficient funds for purchase."]})
        //
        // budgetExist.amount -= input.cost
        // await budgetExist.save()
        //
        // materialExist.quantity += input.quantity
        // materialExist.cost += input.cost
        // await materialExist.save()
        //
        // await BudgetHistory.create(
        //     {
        //         employeeId:input.employerId,
        //         amount:input.cost,
        //         type:"expense"
        //     }
        // )
        //
        // return await RawMaterialPurchase.create(
        //     {
        //         rawMaterialId:materialExist.id,
        //         quantity:input.quantity,
        //         cost:input.cost,
        //         employeeId:input.employerId
        //     }
        // )


        try {
            await sequelize.query(
                "EXEC MakeRawMaterialPurchase @rawMaterialId = :rawMaterialId, @quantity = :quantity, @cost = :cost, @employerId = :employerId",
                {
                    replacements: {
                        rawMaterialId: input.rawMaterialId,
                        quantity: input.quantity,
                        cost: input.cost,
                        employerId: input.employerId,

                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры MakeRawMaterialPurchase:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error",error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }

}