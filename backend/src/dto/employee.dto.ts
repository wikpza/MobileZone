
import {
    IsEmail,
    MinLength
} from "class-validator";
import {
    IsString,
    IsNotEmpty,
    MaxLength,
    IsInt,
    Min,
    Matches,
    Length,
} from 'class-validator';

export class UpdateEmployeeRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'firstName must not be greater than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'lastName must not be greater than 50 characters' })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'middleName must not be greater than 50 characters' })
    middleName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'address must not be greater than 50 characters' })
    address: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+996\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: 'phoneNumber must match the format +996(NNN)NN-NN-NN',
    })
    phone: string;

    @IsInt()
    @Min(1, { message: 'salary must be greater than or equal to 1' })
    salary: number;

    @IsInt()
    @Min(1, { message: 'positionId must be greater than or equal to 1' })
    positionId: number;
}

export class CreateEmployeeRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'firstName must not be greater than 50 characters' })
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'lastName must not be greater than 50 characters' })
    lastName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'middleName must not be greater than 50 characters' })
    middleName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'address must not be greater than 50 characters' })
    address: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+996\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: 'phoneNumber must match the format +996(NNN)NN-NN-NN',
    })
    phone: string;

    @IsInt()
    @Min(1, { message: 'salary must be greater than or equal to 1' })
    salary: number;

    @IsInt()
    @Min(1, { message: 'positionId must be greater than or equal to 1' })
    positionId: number;

    @IsString()
    @IsNotEmpty()
    @Length(3, 20, {
        message: 'login must be between 3 and 20 characters',
    })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'login can only contain letters, numbers and underscores',
    })
    login: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32, {
        message: 'password must be between 8 and 32 characters',
    })
    @Matches(/(?=.*[a-z])(?=.*[A-Z]).*/, {
        message:
            'password must contain at least one lowercase and one uppercase letter',
    })
    password: string;
}

export class UpdateEmployeeDataRequest {
    @IsString()
    @IsNotEmpty()
    @Length(3, 20, {
        message: 'login must be between 3 and 20 characters',
    })
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'login can only contain letters, numbers and underscores',
    })
    login: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32, {
        message: 'password must be between 8 and 32 characters',
    })
    @Matches(/(?=.*[a-z])(?=.*[A-Z]).*/, {
        message:
            'password must contain at least one lowercase and one uppercase letter',
    })
    password: string;
}
export class LoginEmployeeRequest {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'password must be greater than 8 characters' })
    password?: string;

}

export class DirectorSelectRequest {
    @IsInt()
    @Min(1, { message: 'positionId must be greater than or equal to 1' })
    employeeId: number;
}