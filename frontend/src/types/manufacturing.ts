export type GetManufacturingHistoryType = {
    id:number
    productId:number,
    employeeId:number,
    quantity:number,

    employee:{id:number, firstName:string,middleName:string,lastName:string}
    product:{name:string, unit:{id:number, name:string}},
    createdAt:Date
}

export type MakeProductManufacturingType = {
    productId:number,
    quantity:number,
    employeeId:number
}
