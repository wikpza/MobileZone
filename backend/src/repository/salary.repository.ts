import {ISalaryRepositoryInterface} from "../interface/SalaryRepository.interface";
import {
    ChangeSalary,
    ChangeStatusType,
    GenerateSalaryListType,
    GetSalaryListType,
    GiverSalaryType
} from "../models/salary.model";
import {Budget, BudgetHistory, Employee, Salary} from "../database/models";
import sequelize from "../database";
import {Error, Op, QueryTypes} from "sequelize";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import {checkSQLErrorMessage} from "../utils/errors";
import {transformSalaryData} from "../utils";

export class SalaryRepository implements ISalaryRepositoryInterface{
    async giveSalary(input: GiverSalaryType): Promise<void> {
        try {
            console.log(input)
             await sequelize.query(
                "EXEC GiveSalary @year = :year, @month = :month, @employeeId = :employeeId",
                {
                    replacements: {
                        year: input.year,
                        month: input.month,
                        employeeId:input.employeeId
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры GiveSalary:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }
    }

    async changeSalary(input: ChangeSalary): Promise<void> {
        const salaryExist = await Salary.findOne(({where:{id:input.id}}))
        if(!salaryExist) throw new NotFoundError('not found salary row', {id:['not found salary']})
        if(salaryExist.isGiven) throw new ConflictError('salary has already been given', {id:['salary has already been given']})

        try {
            await sequelize.query(
                "EXEC ChangeSalary @id = :id, @newSalary = :newSalary",
                {
                    replacements: {
                        id: input.id,
                        newSalary: input.salary,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры saleProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }
    }

    async changeStatus(input: ChangeStatusType): Promise<Salary> {
        const salaryExist = await Salary.findOne(({where:{id:input.id}}))
        if(!salaryExist) throw new NotFoundError('not found salary row', {id:['not found salary']})

        if(salaryExist.isGiven) throw new ConflictError('salary has already been given', {id:['salary has already been given']})

        const employeeExist  = await Employee.findOne({where:{id:input.employeeId}})
        if(!employeeExist) throw new NotFoundError("not found employee",{employeeId:["not found employee"]})

        const budgetExistNumber = await Budget.count()
        if(budgetExistNumber === 0 ){
             await Budget.create()
        }else if(budgetExistNumber > 1){
            throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        }

        const budgetExist = await Budget.findOne()
        if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})

        if(budgetExist.amount < salaryExist.totalSalary)  throw new ConflictError('There are not enough funds to pay the salaries.', {id:["There are not enough funds to pay the salaries."]})
        budgetExist.amount = budgetExist.amount - salaryExist.totalSalary
        await budgetExist.save()

        salaryExist.isGiven = true
        await salaryExist.save()

        await BudgetHistory.create({
            amount:salaryExist.totalSalary,
            type:"expense",
            employeeId:employeeExist.id
        })
        return salaryExist
    }

    async generateSalaryList(input: GenerateSalaryListType): Promise<Salary> {
        try {
            const result = await sequelize.query(
                "EXEC GenerateSalaryList @year = :year, @month = :month",
                {
                    replacements: {
                        year: input.year,
                        month: input.month,
                    },
                    type: QueryTypes.RAW
                }
            );
            console.log(result)
            return Promise.resolve({} as Salary); // Вернуть данные, если нет ошибок
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры saleProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }

    }

    async getSalaryList(input: GetSalaryListType): Promise<any> {

        try {
            const result = await sequelize.query(
                "EXEC GenerateSalaryList @year = :year, @month = :month",
                {
                    replacements: {
                        year: input.year,
                        month: input.month,
                    },
                    type: QueryTypes.RAW
                }
            );
            console.log(result)
            return result[0].map(transformSalaryData);
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры saleProduct:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }
    }


    //     const offset = (input.page - 1) * input.limit;
    //
    //
    //     return await Salary.findAll({
    //         limit: input.limit, // Количество записей на странице
    //         offset: offset, // Пропускаем записи для пагинации
    //         order: [[input.sortBy, "DESC"]], // Сортировка (по переданному полю)
    //         where: {
    //             // Фильтруем по месяцу и году, если они переданы
    //             salaryDate: {
    //                 [Op.between]: [
    //                     new Date(input.year, input.month - 1, 1), // Начало месяца
    //                     new Date(input.year, input.month, 0) // Конец месяца (предпоследний день месяца)
    //                 ]
    //             }
    //         },
    //         include: [
    //             {
    //                 model: Employee,
    //                 attributes: ["id", "firstName", "lastName", "middleName"]
    //             }
    //         ]
    //     });
    //
    // }



}