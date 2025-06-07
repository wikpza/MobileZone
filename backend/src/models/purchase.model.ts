export type GetPurchasesType = {
    page:number,
    limit:number,
    sortBy:string,
    beforeDate?:Date,
    toDate?:Date
}

export type MakePurchasesType = {
    rawMaterialId:number,
    quantity:number,
    cost:number,
    employerId:number,

}