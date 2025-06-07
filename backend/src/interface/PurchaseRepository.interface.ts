import {GetPurchasesType, MakePurchasesType} from "../models/purchase.model";
import {RawMaterialPurchase} from "../database/models";

export interface IPurchaseRepositoryInterface{
    getPurchases(input:GetPurchasesType):Promise<RawMaterialPurchase[]>
    makePurchases(input:MakePurchasesType):Promise<void>
}