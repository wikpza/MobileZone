import {GetSalaryList} from "@/types/salary.ts";
import {GetManufacturingHistoryType} from "@/types/manufacturing.ts";
import {GetPurchaseType} from "@/types/purchase.ts";
import {GetProductSaleHistoryType} from "@/types/product.ts";

export type Employee = {
  id: number
  name: string
  position: string
  email: string
  createdAt: Date
  updatedAt: Date
}


export type CreateEmployeeType = {
  firstName: string,
  lastName: string,
  middleName: string,
  salary: number,
  address: string,
  phone:string,
  positionId:number,
  login:string,
  password:string
}

export type UpdateEmployeeDataType = {
  id:number
  login:string,
  password:string
}

export type DeleteEmployeeType = {id:number}
export type UpdateEmployeeType = {
  id:number,
  firstName: string,
  lastName: string,
  middleName: string,
  salary: number,
  address: string,
  phone:string,
  positionId:number,
}
export type GetEmployeeType = {
  firstName: string,
  lastName: string,
  middleName: string,
  salary: number,
  address: string,
  phone:string,
  id:number,
  positionId:number,
  createdAt:Date,
  updatedAt:Date,
  position:{name:string}
}

export type LoginEmployeeType = {
  login:string,
  password:string,
}
export type EmployeeTokenType = {
  id: number
  firstName: string
  lastName: string
  middleName:string
  login: string
  phone:string
}



export type GetEmployeeData = {
  employee:GetEmployeeType,
  salary: GetSalaryList[],
  manufacturing:GetManufacturingHistoryType[]
  purchase:GetPurchaseType[]
  sale:GetProductSaleHistoryType[]
}