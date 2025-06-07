import {
    CountPayLoanType,
    CreateLoanType,
    GetLoanListType,
    GetLoanPaymentHistoryType,
    PayLoanType, ResultPayLoanType
} from "../models/loan.model";
import {Loan, LoanPayment} from "../database/models";

export interface ILoanRepositoryInterface{
    getLoanList(input:GetLoanListType):Promise<Loan[]>
    createLoan(input:CreateLoanType):Promise<void>
    getLoanPaymentHistory(input:GetLoanPaymentHistoryType):Promise<LoanPayment[]>
    payLoan(input:PayLoanType):Promise<any>
    countPayLoan(input:CountPayLoanType):Promise<ResultPayLoanType>
}