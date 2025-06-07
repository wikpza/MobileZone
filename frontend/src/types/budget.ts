export type GetBudgetType = {
    id:number,
    amount:number,
   markUp:number,
    createdAt:Date,
    updatedAt:Date
    bonus:number
}

export type GetBudgetHistoryType = {
    id:number,
    amount:number,
    employerId:number,
    employee:{id:number, lastName:string, middleName:string, firstName:string}
    type:string,
    createdAt:Date,
    updatedAt:Date
}

export type IncomeBudget = {
    amount:number
}
export type SetMarkUpType= {
    markUp:number
}

export type SetBonusType= {
    employeeId:number,
    bonus:number
}