import {IsInt, IsNumber, IsPositive, Min} from "class-validator";

export class MakePurchaseRequest {

    @IsInt()
    @Min(0, { message: 'rawMaterialId must be greater than or equal to 1' })
    materialId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @IsPositive({ message: 'Quantity must be greater than 0' })
    quantity: number;

    @IsNumber({}, { message: 'cost must be a number' })
    @IsPositive({ message: 'cost must be greater than 0' })
    cost: number;

}
