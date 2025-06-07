export type GetBudgetType = {
    id:number
}
export type IncomeBudgetType = {
    id:number,
    amount:number
}

export type GetBudgetHistoryType = {
    page:number,
    limit:number,
    sortBy:string,
}

export type UpdateMarkUp = {
    markUp:number
}

export type UpdateBonus = {
    bonus:number
}