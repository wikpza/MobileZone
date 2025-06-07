export type GetLoanListType = {
    page:number,
    limit:number,
    sortBy:string,

}

export type CreateLoanType = {
    employeeId:number,
    loanSum:number,
    procentStavka:number
    periodYear:number,
    penyaStavka:number,
}

export type GetLoanPaymentHistoryType = {
    page:number,
    limit:number,
    sortBy:string,
    loanId?:number
    beforeDate?:Date,
    toDate?:Date
}
export type PayLoanType ={
    loanId:number,
    giveDate:Date,
    employeeId:number
}

export type CountPayLoanType = {
    loanId:number,
    giveDate:Date,
}

export type ResultPayLoanType = {
    LastPaymentDate: Date,
    loanPart: number,
    loanProcent: number,
    penya: number,
    overdueDays: number
}