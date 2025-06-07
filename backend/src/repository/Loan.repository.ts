import {ILoanRepositoryInterface} from "../interface/LoanRepository.interface";
import {
    CountPayLoanType,
    CreateLoanType,
    GetLoanListType,
    GetLoanPaymentHistoryType,
    PayLoanType, ResultPayLoanType
} from "../models/loan.model";
import {Budget, BudgetHistory, Employee, Loan, LoanPayment} from "../database/models";
import sequelize from "../database";
import {Error, Op, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import {isResultPayLoanType} from "../utils";


// Вспомогательные функции
function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

function dateDiffInDays(startDate: Date, endDate: Date): number {

    const diffTime = endDate.getTime() - startDate.getTime();

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export class LoanRepository implements ILoanRepositoryInterface{
    async createLoan(input: CreateLoanType): Promise<void> {
        // const budgetExistNumber = await Budget.count()
        // if(budgetExistNumber === 0 ){
        //      await Budget.create()
        // }else if(budgetExistNumber > 1){
        //     throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        // }
        // const budgetExist = await Budget.findOne()
        // if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})
        //
        // const employeeExist = await Employee.findOne({where:{id:input.employeeId}})
        // if(!employeeExist) throw new NotFoundError('not found employee', {employeeId:['not found employee']})
        //
        // const newLoan = await Loan.create(
        //     {
        //         loanSum:input.loanSum,
        //         procentStavka:input.procentStavka,
        //         periodYear:input.periodYear,
        //         penyaStavka:input.penyaStavka,
        //         takeDate:Date.now(),
        //     })
        //
        // budgetExist.amount = budgetExist.amount + input.loanSum
        // await budgetExist.save()
        //
        // await BudgetHistory.create({amount:input.loanSum, type:'income', employeeId:employeeExist.id})
        // return newLoan


        try {
            await sequelize.query(
                "EXEC TakeLoan @employeeId = :employeeId, @loanSum = :loanSum, @procentStavka = :procentStavka, @periodYear = :periodYear, @penyaStavka = :penyaStavka",
                {
                    replacements: {
                        employeeId: input.employeeId,
                        loanSum: input.loanSum,
                        procentStavka: input.procentStavka,
                        periodYear: input.periodYear,
                        penyaStavka: input.penyaStavka,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры TakeLoan:", error.message);

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

    async getLoanList(input: GetLoanListType): Promise<Loan[]> {

        const offset = (input.page - 1) * input.limit;
        return await Loan.findAll({
            limit: input.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[input.sortBy, "DESC"]], // Сортировка (по переданному полю)
        });
    }

    async getLoanPaymentHistory(input: GetLoanPaymentHistoryType): Promise<LoanPayment[]> {
        const whereParameter:any = {}

        if(input.loanId) whereParameter.loanId = input.loanId

        if (input.beforeDate && input.toDate) {
            whereParameter.createdAt = {
                [Op.between]: [input.beforeDate, input.toDate]
            };
        }
        // Если передана только конечная дата (beforeDate)
        else if (input.beforeDate) {
            whereParameter.createdAt = {
                [Op.lte]: input.beforeDate
            };
        }
        // Если передана только начальная дата (toDate)
        else if (input.toDate) {
            whereParameter.createdAt = {
                [Op.gte]: input.toDate
            };
        }

        const offset = (input.page - 1) * input.limit;
        return await LoanPayment.findAll({
            where:whereParameter,
            limit: input.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[input.sortBy, "DESC"]], // Сортировка (по переданному полю)
            include:[
                {
                    model:Loan,
                    attributes:["loanSum", "procentStavka", "periodYear", "penyaStavka", "takeDate", "statusFinished"]
                }
            ]
        });
    }

    async payLoan(input: PayLoanType): Promise<any> {
        try {

            await sequelize.query(
                "EXEC PayLoan @loanId = :loanId, @giveDate = :giveDate, @employeeId = :employeeId",
                {
                    replacements: {
                        loanId: input.loanId,
                        giveDate: input.giveDate,
                        employeeId: input.employeeId
                    },
                    type: QueryTypes.RAW
                }
            );

        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры pay loan:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    console.log(sqlError)
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error" )
                }
            }
            console.log(error)
            throw new BaseError("Internal SQL error", 500,"Internal SQL error" )

        }
    }

    async countPayLoan(input: CountPayLoanType): Promise<ResultPayLoanType> {

        // Здесь должна быть логика получения данных о кредите из БД
        // Это пример - замените на реальный запрос к вашей БД
        const loan = await Loan.findOne({where:{id:input.loanId}})
        if(!loan) throw new NotFoundError('not found loan', {loanId:['not found loan']})


        // Получаем последний платеж по кредиту
        const lastPayment = await LoanPayment.findOne({where:{loanId:input.loanId}, order: [['giveDate', 'DESC']]})

        const paymentCount= await LoanPayment.count({where:{loanId:input.loanId}})
        // Инициализация переменных как в SQL процедуре
        let outstandingBalance = lastPayment ? lastPayment.OstatokDolga : loan.loanSum;

        // Расчеты
        const loanPart = loan.loanSum / loan.periodYear / 12;
        const loanProcent = outstandingBalance / 100 * loan.procentStavka / 12;
        const loanSum = loanPart + loanProcent;
        // const loanLast = outstandingBalance - loanPart;

        // Расчет просрочки
        const payDay = addMonths(loan.takeDate, paymentCount === 0? 1: paymentCount + 1 );
        let overdueDays = dateDiffInDays(payDay, input.giveDate);
        overdueDays = overdueDays < 0 ? 0 : overdueDays;

        const penya = loanSum / 100 * loan.penyaStavka * overdueDays;

        return {
            LastPaymentDate:payDay,
            loanPart,
            loanProcent,
            penya,
            overdueDays,
        };
    }

}
