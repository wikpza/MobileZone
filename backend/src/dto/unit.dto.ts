import {IsNotEmpty, IsString, MaxLength} from "class-validator";


export class CreateUnitRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;
}

export class UpdateUnitRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;
}
