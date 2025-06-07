import {RawMaterial} from "../database/models";
import {
    CreateRawMaterial,
    DeleteRawMaterialType,
    GetRawMaterialsType, GetRawMaterialType,
    UpdateRawMaterialType
} from "../models/rawMaterial.model";

export interface IRawMaterialRepository{
    createRawMaterial(data:CreateRawMaterial):Promise<void>
    updateRawMaterial(data:UpdateRawMaterialType):Promise<void>
    deleteRawMaterial(data:DeleteRawMaterialType):Promise<void>
    getRawMaterials(data:GetRawMaterialsType):Promise<RawMaterial[]>
    getRawMaterial(data:GetRawMaterialType):Promise<RawMaterial>
}