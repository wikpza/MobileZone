export type GetPurchaseType = {
    id:number,
    rawMaterialId:number,
    quantity:number,
    cost:number,
    employeeId:number,
    createdAt:Date,
    updatedAt:Date,
    raw_material:
        {
        id:number,
            unitId:number,
            name:string,
            unit:{id:number,name:string,}
    },
    employee:{
        id:number,
        firstName:string,
        middleName:string,
        lastName:string,
    }
}


export type MakeRawMaterialPurchaseType = {
    materialId:number,
    quantity:number,
    cost:number
}