import {IsInt, Max, Min} from "class-validator";

export class ChangeSalaryRequest {
    @IsInt()
    @Min(1, { message: 'salary must be greater than or equal to 1' })
    salary: number;
}

export class GenerateSalaryListRequest {
    @IsInt()
    @Min(1, {message: 'month must be between 1 and 12'})
    @Max(12, {message: 'month must be between 1 and 12'})
    month: number;

    @IsInt()
    @Min(1990, {message: 'year must be between 1990 and the current year'})
    @Max(new Date().getFullYear() + 1, {message: `year must be between 1990 and ${new Date().getFullYear() + 1}`})
    year: number
}

export class ChangeSalaryStatusRequest {
    @IsInt()
    @Min(0, { message: 'employeeId must be greater than or equal to 1' })
    employeeId: number;
}

export class GiveSalaryRequest {
    @IsInt()
    @Min(1, {message: 'month must be between 1 and 12'})
    @Max(12, {message: 'month must be between 1 and 12'})
    month: number;

    @IsInt()
    @Min(1990, {message: 'year must be between 1990 and the current year'})
    @Max(new Date().getFullYear(), {message: `year must be between 1990 and ${new Date().getFullYear()}`})
    year: number

}

