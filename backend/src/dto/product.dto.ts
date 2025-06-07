import {IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Min} from "class-validator";

export class CreateProductRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50, { message: 'name must not be greater than 50 characters' })
    name: string;

    @IsInt()
    @Min(0, {message:"id must be greater or equal than 0"})
    unitId:number
}

export class SaleProductRequest {
    @IsInt()
    @Min(0, { message: 'productId must be greater than or equal to 1' })
    productId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @IsPositive({ message: 'Quantity must be greater than 0' })
    quantity: number;

}
export class UpdateProductRequest extends  CreateProductRequest {}