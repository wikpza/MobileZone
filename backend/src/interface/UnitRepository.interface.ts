import { Unit} from "../database/models";
import {CreateUnitType, DeleteUnitType, GetUnitsType, GetUnitType, UpdateUnitType} from "../models/unit.model";

export interface IUnitRepository{
    createUnit(data:CreateUnitType):void
    updateUnit(data:UpdateUnitType):void
    deleteUnit(data:DeleteUnitType):void
    getUnits(data:GetUnitsType):Promise<Unit[]>
    getUnit(data:GetUnitType):Promise<Unit>
}
