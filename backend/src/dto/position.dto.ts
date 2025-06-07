import {IsEmail, IsInt, IsNotEmpty, IsString, Matches, Max, MaxLength, Min, MinLength} from "class-validator";

export class CreatePositionRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;
}

export class UpdatePositionRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;
}

