import {IEmployeeRepository} from "../interface/EmployeeRepository.interface";
import {
    CreateEmployeeType,
    DeleteEmployeeType, GetEmployeeData,
    GetEmployeeType,
    LoginEmployeeType, TokenEmployee, UpdateEmployeeDataType,
    UpdateEmployeeType
} from "../models/employee.model";
import {
    Budget,
    BudgetHistory,
    Employee,
    Position, Product,
    ProductManufacturing,
    ProductSale, RawMaterial,
    RawMaterialPurchase,
    Salary, Unit
} from "../database/models";
import {AuthorizeError, BaseError, ConflictError, NotFoundError, ValidationError} from "../utils/error";
import bcrypt from 'bcrypt'
import sequelize from "../database";
import {Error, QueryTypes} from "sequelize";
import {checkSQLErrorMessage} from "../utils/errors";
import {query} from "express";

export class EmployeeRepository implements IEmployeeRepository{
    constructor() {
    }

    async createEmployee(data: CreateEmployeeType): Promise<void> {
        // const positionExist = await Position.findOne({where:{id:data.positionId}})
        // if(!positionExist) throw new NotFoundError("not found position",{positionId:["not found position"]})
        //
        // return Employee.create(
        //     {
        //         firstName:data.firstName,
        //         lastName:data.lastName,
        //         middleName:data.middleName,
        //         salary:data.salary,
        //         address:data.address,
        //         phone:data.phone,
        //         positionId:positionExist.id,
        //     }
        // )

        try {
            await sequelize.query(
                "EXEC CreateEmployee @firstName = :firstName, @lastName = :lastName, @middleName = :middleName, @salary = :salary, @address = :address, @phone = :phone, @positionId = :positionId, @login = :login, @password = :password",
                {
                    replacements: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        salary: data.salary,
                        middleName: data.middleName,
                        address: data.address,
                        phone: data.phone,
                        positionId: data.positionId,
                        login: data.login,
                        password: data.password
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры CreateEmployee:", error.message);

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

    async deleteEmployee(data: DeleteEmployeeType): Promise<void> {
        // const employeeExist = await Employee.findOne({where:{id:data.id}})
        // if(!employeeExist) throw  new NotFoundError('not found employee', {id:["not found employee"]})
        //
        // const rawMaterialPurchaseExist = await RawMaterialPurchase.findOne({where:{employeeId:data.id}})
        // if(rawMaterialPurchaseExist) throw  new ConflictError('unable to delete, because he take part in raw material purchase', {id:['unable to delete, because he take part in raw material purchase']})
        //
        //
        // const productSaleExist = await ProductSale.findOne({where:{employeeId:data.id}})
        // if(productSaleExist) throw  new ConflictError('unable to delete, because he take part in product selling', {id:['unable to delete, because he take part in product selling']})
        //
        //
        // const budgetHistoryExist = await BudgetHistory.findOne({where:{employeeId:data.id}})
        // if(budgetHistoryExist) throw  new ConflictError('unable to delete, because he take part in budget transaction', {id:['unable to delete, because he take part in budget transaction']})
        //
        // const deletedEmployee = await Employee.destroy({where:{id:data.id}})
        // if(deletedEmployee === 0 )throw  new ConflictError('unable to delete employee', {id:['unable to delete employee']})
        // return employeeExist

        try {
            await sequelize.query(
                "EXEC DeleteEmployee @id = :id",
                {
                    replacements: {
                        id: data.id,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры DeleteEmployee:", error.message);

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

    async getEmployeeList(data: GetEmployeeType): Promise<Employee[]> {
        const offset = (data.page - 1) * data.limit;
        return await Employee.findAll({
            attributes: ['id',
                "firstName",
            "lastName",
            "salary",
            "middleName",
            "address",
            "phone",
            "positionId",
            ],
            limit: data.limit, // Количество записей на странице
            offset: offset, // Пропускаем записи для пагинации
            order: [[data.sortBy, "DESC"]], // Сортировка (по переданному полю)
            include:[
                {
                    model:Position,
                    attributes:["name"]
                }
            ]
        });
    }

    async updateEmployee(data: UpdateEmployeeType): Promise<void> {
        try {
            await sequelize.query(
                "EXEC UpdateEmployee @id = :id, @firstName = :firstName, @lastName = :lastName, @middleName = :middleName, @salary = :salary, @address = :address, @phone = :phone, @positionId = :positionId",
                {
                    replacements: {
                        id: data.id,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        salary: data.salary,
                        middleName: data.middleName,
                        address: data.address,
                        phone: data.phone,
                        positionId: data.positionId,
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateEmployee:", error.message);

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

    async login(data: LoginEmployeeType): Promise<TokenEmployee> {
        try {
            const query = [
                "declare @id INT;",
                "DECLARE @firstName NVARCHAR(50);",
                "DECLARE @lastName NVARCHAR(50);",
                "DECLARE @middleName NVARCHAR(50);",
                "DECLARE @phone NVARCHAR(50);",
                "",
                "EXEC LoginEmployee",
                "    @login = :login,",
                "    @password = :password,",
                "    @id = @id OUTPUT,",
                "    @firstName = @firstName OUTPUT,",
                "    @lastName = @lastName OUTPUT,",
                "    @middleName = @middleName OUTPUT,",
                "    @phone = @phone OUTPUT;",
                "",
                "SELECT ",
                "    @id AS id,",
                "    @firstName AS firstName,",
                "    @lastName AS lastName,",
                "    @middleName AS middleName,",
                "    @phone AS phone;"
            ].join("\n"); // Собираем в одну строку с переносами

            const results = await sequelize.query<[TokenEmployee[], unknown]>(query, {
                replacements: {
                    login: data.login,
                    password: data.password
                },
                type: QueryTypes.SELECT,
            });

            console.log(results)
            if (!results || results.length === 0 || !results[0]) {
                throw new ConflictError('Unable to login', { login: ['Invalid credentials'] });
            }

            // Явно проверяем структуру результата
            const firstResult = results[0] as Partial<TokenEmployee>;

            if (!firstResult.id || !firstResult.firstName || !firstResult.lastName || !firstResult.phone || !firstResult.middleName) {
                throw new ConflictError('Invalid response structure', { system: ['Database returned invalid data'] });
            }

            return firstResult as TokenEmployee;
            // const result = await sequelize.query(
            //     "EXEC LoginEmployee @login = :login, @password = :password",
            //     {
            //         replacements: {
            //             login: data.login,
            //             password: data.password,
            //         },
            //         type: QueryTypes.RAW
            //     }
            // );
            //
            // return Promise.resolve({} as Salary); // Вернуть данные, если нет ошибок
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры Login Employee:", error.message);

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

    async updateEmployeeData(data: UpdateEmployeeDataType): Promise<void> {
        try {
            await sequelize.query(
                "EXEC UpdateEmployeeData @id = :id, @login = :login, @password = :password",
                {
                    replacements: {
                        id: data.id,
                        login: data.login,
                        password: data.password,
                    },
                    type: QueryTypes.UPDATE
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры UpdateEmployeeData:", error.message);

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

    async getEmployeeData(data: { id: number }): Promise<Employee> {
        const employeeExist = await Employee.findOne({
            where:{
                id:data.id
            },
            attributes: ['id',
                "firstName",
                "lastName",
                "salary",
                "middleName",
                "address",
                "phone",
                "positionId",
                'createdAt'
            ],
            include:[
                {
                    model:Position,
                    attributes:["name"]
                }
            ]
        });
        if(!employeeExist) throw new AuthorizeError('not access',{id:['no access']})
        return employeeExist
    }

    async getEmployeeStatistic(data: { id: number }): Promise<GetEmployeeData> {
        const employeeExist = await Employee.findOne({where:{id:data.id},  include:[
                {
                    model:Position,
                    attributes:["name"]
                }
            ]})
        if(!employeeExist) throw new NotFoundError('id', {id:['not found employee']})

        const salaryList = await Salary.findAll({where:{employeeId:data.id, isGiven:true}})

        const manufacturingList = await  ProductManufacturing.findAll({where:{employeeId:data.id}, include: [
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
            ]})
        const purchaseList = await RawMaterialPurchase.findAll({where:{employeeId:data.id}, include: [
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
            ]})
        const productSaleList = await ProductSale.findAll({where:{employeeId:data.id},  include: [
                {
                    model: Product,
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
            ]})


        return {
            employee:employeeExist,
            salary: salaryList,
            manufacturing:manufacturingList,
            purchase:purchaseList,
            sale:productSaleList
        }
    }

    async getDirector(): Promise<Employee | null> {
        const budgetExistNumber = await Budget.count()
        if(budgetExistNumber === 0 ){
             await Budget.create()
            return null
        }else if(budgetExistNumber > 1){
            throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        }
        const budgetExist = await Budget.findOne()
        if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})

        if(!budgetExist.employeeId) return null

        const employeeExist = await Employee.findOne({where:{id:budgetExist.employeeId}, include:[{model:Position}]})
        if(!employeeExist) throw new NotFoundError('Can not found Employee')
        return employeeExist

    }

    async setDirector(data: { employeeId: number }): Promise<Employee> {
        const employeeExist = await Employee.findOne({where:{id:data.employeeId}, include:[{model:Position}]})
        if(!employeeExist) throw new NotFoundError('Can not found Employee')

        const budgetExistNumber = await Budget.count()
        if(budgetExistNumber === 0 ){
            await Budget.create({employeeId:data.employeeId})
            return employeeExist
        }else if(budgetExistNumber > 1){
            throw new ConflictError('Unable to get Budget: error in system', {id:["Unable to get Budget: error in system"]})
        }
        const budgetExist = await Budget.findOne()
        if(!budgetExist) throw new NotFoundError('not found budget', {id:['not found budget']})

       budgetExist.employeeId = data.employeeId
        await budgetExist.save()

        return employeeExist

    }
}
