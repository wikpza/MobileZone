export type CreateManufacturingType = {
    productId:number,
    quantity:number,
    employeeId:number
}


export type GetManufacturingType = {
    page:number,
    limit:number,
    sortBy:string,
    beforeDate?:Date,
    toDate?:Date
}