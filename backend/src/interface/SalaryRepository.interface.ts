import {ChangeSalary, ChangeStatusType, GenerateSalaryListType, GetSalaryListType} from "../models/salary.model";
import {Salary} from "../database/models";
import {GiveSalaryType} from "../dto/salary.dto";

export interface ISalaryRepositoryInterface{
    generateSalaryList(input:GenerateSalaryListType):Promise<any>
    getSalaryList(input:GetSalaryListType):Promise<Salary[]>
    changeStatus(input:ChangeStatusType):Promise<Salary>

    changeSalary(input:ChangeSalary):Promise<void>
    giveSalary(input:GiveSalaryType):Promise<void>
}