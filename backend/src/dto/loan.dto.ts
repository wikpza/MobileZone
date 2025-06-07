import {IsInt, IsNumber, Min, IsDateString, IsISO8601} from "class-validator";

export class CreateLoanRequest {
    // @IsInt()
    // @Min(1, { message: 'employeeId must be greater than or equal to 1' })
    // employeeId: number;

    @IsNumber()
    @Min(1, { message: 'loanSum must be greater than or equal to 1' })
    loanSum: number;

    @IsNumber()
    @Min(0.01, { message: 'procentStavka must be greater than or equal to 0.01' })
    procentStavka: number;

    @IsInt()
    @Min(1, { message: 'periodYear must be greater than or equal to 1' })
    periodYear: number;

    @IsNumber()
    @Min(0.01, { message: 'penyaStavka must be greater than or equal to 0.01' })
    penyaStavka: number;
}

export class PayLoanRequest {

    @IsInt()
    @Min(1, { message: 'loanId must be greater than or equal to 1' })
    loanId: number;

    @IsISO8601()
    giveDate: string;
}
