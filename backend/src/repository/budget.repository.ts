import {IBudgetRepository} from "../interface/BudgetRepository.interface";
import {GetBudgetHistoryType, GetBudgetType, IncomeBudgetType, UpdateBonus, UpdateMarkUp} from "../models/budget.model";
import {Budget, BudgetHistory, Employee, Unit} from "../database/models";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import {Error, Op, QueryTypes} from "sequelize";
import sequelize from "../database";
import {checkSQLErrorMessage} from "../utils/errors";

export class BudgetRepository implements IBudgetRepository{
    async getBudget(): Promise<Budget> {
        const budgetExistNumber = await Budget.count()
        if(budgetExistNumber === 0 ){
          return await Budget.create()
        }else if(budgetExistNumber > 1){
            throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        }
        const budgetExist = await Budget.findOne()
        if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        return budgetExist
    }

    async getBudgetHistory(data: GetBudgetHistoryType): Promise<BudgetHistory[]> {
        // const employeeExist = await Employee.findOne({where:{id:data.id}})
        // if(!employeeExist) throw new NotFoundError('not found user', {id:['not found user']})

        const offset = (data.page - 1) * data.limit;
        return await BudgetHistory.findAll({
            limit: data.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "DESC"]], // Сортировка (по переданному полю)
            include:[
                {
                model:Employee,
                attributes:["id", "firstName", "lastName","middleName"]
            }
            ]
        });
    }

    async incomeBudget(input: IncomeBudgetType): Promise<void> {
        // const employeeExist = await Employee.findOne({where:{id:input.id}})
        // if(!employeeExist) throw new NotFoundError('not found user', {id:['not found user']})
        //
        // const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //     return await Budget.create()
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        // }
        //
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        //
        // budgetExist.amount += input.amount
        // await budgetExist.save()
        //
        // console.log(employeeExist)
        // await BudgetHistory.create({
        //     employeeId:employeeExist.id,
        //     amount:input.amount,
        //     type:'income'
        // })
        //
        // return budgetExist

        try {
            await sequelize.query(
                "EXEC IncomeBudget @id = :id, @amount = :amount",
                {
                    replacements: {
                        id: input.id,
                        amount: input.amount
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры IncomeBudget:", error.message);

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

    async updateMarkUp(input: UpdateMarkUp): Promise<void> {
        // const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //     return await Budget.create()
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        // }
        //
        //
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        //
        // budgetExist.markUp = input.markUp
        // await budgetExist.save()
        // console.log("show budget new ")
        //
        // return budgetExist

        try {
            await sequelize.query(
                "EXEC UpdateMarkUp @markUp = :markUp",
                {
                    replacements: {
                        markUp: input.markUp
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateMarkUp:", error.message);

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

    async updateBonus(input: UpdateBonus): Promise<void> {
        const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //     return await Budget.create()
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        // }
        //
        //
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        //
        // budgetExist.bonus = input.bonus
        // await budgetExist.save()
        // return budgetExist

        try {
            await sequelize.query(
                "EXEC UpdateBonus @bonus = :bonus",
                {
                    replacements: {
                        bonus: input.bonus
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateBonus:", error.message);

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