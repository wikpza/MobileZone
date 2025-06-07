export type GetLoanType = {
    id:number,
    loanSum:number,
    procentStavka:number,
    periodYear:number,
    penyaStavka:number,
    takeDate:Date,
    statusFinished:boolean,
    createdAt:Date,
    updatedAt:Date
}

export type TakeLoanType = {
    loanSum:number,
    procentStavka:number,
    periodYear:number,
    penyaStavka:number
}

export type GetLoanPaymentType = {
    id:number,
    loanId:number,
    giveDate:Date,
    mainLoan:number,
    procentSumma:number,
    penyaSumma:number,
    OstatokDolga:number,
    createdAt:Date,
    updatedAt:Date,
    overdueDay:number
    loan:{
        loanSum:number,
        procentStavka:number,
        periodYear:number,
        penyaStavka:number,
        takeDate:Date,
        statusFinished:boolean
    }
}

export type PayLoanType = {
    loanId:number,
    giveDate: Date,
    employeeId: number
}

export type ResultPayLoanType = {
    LastPaymentDate?: Date,
    loanPart?: number,
    loanProcent?: number,
    penya?: number,
    overdueDays?: number
}