import {IsInt, IsNumber, IsPositive, Min} from "class-validator";

export class MakeManufacturingRequest {
    @IsInt()
    @Min(0, { message: 'productId must be greater than or equal to 1' })
    productId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @IsPositive({ message: 'Quantity must be greater than 0' })
    quantity: number;
}