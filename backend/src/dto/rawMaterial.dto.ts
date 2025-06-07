import {IsInt, IsNotEmpty, IsString, MaxLength, Min} from "class-validator";

export class CreateRawMaterialRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;

    @IsInt()
    @Min(0, { message: 'unitId must be greater than or equal to 1' })
    unitId: number;
}

