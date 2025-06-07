import {IsInt, IsNumber, IsPositive, Min} from "class-validator";

export class IncomeBudgetRequest {
    @IsNumber({}, { message: 'Quantity must be a number' })
    @IsPositive({ message: 'Quantity must be greater than 0' })
    amount: number;

}

export class UpdateMarkUpRequest {
    @IsInt()
    @Min(0, { message: 'markUp must be greater than or equal to 1' })
        markUp: number;

}

export class UpdateBonusRequest {
    @IsInt()
    @Min(0, { message: 'bonus must be greater than or equal to 1' })
    bonus: number;

}