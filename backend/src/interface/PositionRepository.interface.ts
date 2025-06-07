import {
    CreatePositionType,
    DeletePositionType,
    GetPositionsType,
    GetPositionType,
    UpdatePositionType
} from "../models/postion.model";
import {Position} from "../database/models";

export interface IPositionRepository{
    createPosition(data:CreatePositionType):Promise<void>
    updatePosition(data:UpdatePositionType):Promise<void>
    deletePosition(data:DeletePositionType):Promise<void>
    getPositions(data:GetPositionsType):Promise<Position[]>
    getPosition(data:GetPositionType):Promise<Position>
}
