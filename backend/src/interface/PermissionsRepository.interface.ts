import {Permissions, PositionPermissions} from "../database/models";
import {ChangePermissionStatus, GetPermissions, GetPositionPermissions} from "../models/permissions.model";


export interface IPermissionsRepository{
    getPermissions(input:GetPermissions):Promise<Permissions[]>
    changePermissionStatus(input:ChangePermissionStatus):Promise<void>
    getPositionPermission(input:GetPositionPermissions):Promise<PositionPermissions[]>
}