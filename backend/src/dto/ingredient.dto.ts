import {
    IsInt, IsNumber, IsPositive,
    Min, Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

// Создаем кастомный валидатор
@ValidatorConstraint({ name: "isPositiveInteger", async: false })
export class IsPositiveIntegerConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        return typeof value === "number" && Number.isInteger(value) && value > 0; // Значение должно быть целым и больше 0
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be a positive integer greater than 0`;
    }
}

export class AddIngredientRequest {

    @IsInt()
    @Min(0, { message: 'rawMaterialId must be greater than or equal to 1' })
    materialId: number;

    @IsNumber({}, { message: 'Quantity must be a number' })
    @IsPositive({ message: 'Quantity must be greater than 0' })
    quantity: number;
}

export class UpdateIngredientRequest {

    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(0.0001, { message: 'Quantity must be greater than 0 and cannot be zero' })
    quantity: number;
}

