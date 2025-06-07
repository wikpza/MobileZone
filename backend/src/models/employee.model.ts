import {Employee, ProductManufacturing, ProductSale, RawMaterialPurchase, Salary} from "../database/models";

export interface  CreateEmployeeType  {
         firstName: string,
         lastName: string,
         middleName: string,
         salary: number,
         address: string,
         phone:string,
         positionId:number,
         password:string,
         login:string,
}

export type UpdateEmployeeDataType = {
    id:number,
    login:string,
    password:string
}
export interface  UpdateEmployeeType  {
    id:number
    firstName: string,
    lastName: string,
    middleName: string,
    salary: number,
    address: string,
    phone:string,
    positionId:number,
}


export interface DeleteEmployeeType {
    id:number
}

export type GetEmployeeType = {
    page:number,
    limit:number,
    sortBy:string,
}

export class LoginEmployeeType {
    constructor(
        public readonly login:string,
        public readonly password:string,
    ) {
    }
}



export type TokenEmployee = {
    id:number,
    lastName:string,
    firstName:string,
    middleName:string,
    login:string,
    phone:string,

}


export type GetEmployeeData = {
    employee:Employee,
    salary: Salary[],
    manufacturing:ProductManufacturing[]
    purchase:RawMaterialPurchase[]
    sale:ProductSale[]
}