import {CreateManufacturingType, GetManufacturingType} from "../models/manufacturing.model";
import {ProductManufacturing} from "../database/models";

export interface IManufacturingInterface{
    makeProduct(input:CreateManufacturingType):Promise<void>
    getManufacturingHistory(input:GetManufacturingType):Promise<ProductManufacturing[]>
}