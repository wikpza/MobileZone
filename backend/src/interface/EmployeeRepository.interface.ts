import {
    CreateEmployeeType,
    DeleteEmployeeType, GetEmployeeData,
    GetEmployeeType,
    LoginEmployeeType, TokenEmployee, UpdateEmployeeDataType,
    UpdateEmployeeType
} from "../models/employee.model";
import {Employee} from "../database/models";


export interface IEmployeeRepository{
    createEmployee(data:CreateEmployeeType):Promise<void>
    updateEmployee(data:UpdateEmployeeType):Promise<void>
    deleteEmployee(data:DeleteEmployeeType):Promise<void>
    getEmployeeList(data:GetEmployeeType):Promise<Employee[]>
    login(data:LoginEmployeeType):Promise<TokenEmployee>

    updateEmployeeData(data:UpdateEmployeeDataType):Promise<void>
    getEmployeeData(data:{id:number}):Promise<Employee>
    getEmployeeStatistic(data:{id:number}):Promise<GetEmployeeData>

    setDirector(data:{employeeId:number}):Promise<Employee | null>
    getDirector():Promise<Employee | null>
}