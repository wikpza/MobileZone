import {IPermissionsRepository} from "../interface/PermissionsRepository.interface";
import {ChangePermissionStatus, GetPermissions, GetPositionPermissions} from "../models/permissions.model";
import { Permissions, Position, PositionPermissions} from "../database/models";
import {Error, QueryTypes, where} from "sequelize";
import {BaseError, ConflictError, NotFoundError} from "../utils/error";
import sequelize from "../database";
import {checkSQLErrorMessage} from "../utils/errors";

export class PermissionRepository implements IPermissionsRepository {
    async changePermissionStatus(input: ChangePermissionStatus): Promise<void> {
        if( !(input.type == "add" || input.type === "delete") ){
            throw new ConflictError("incorrect type: must be add or delete", {type:["incorrect type: must be add or delete"]})
        }
        // const positionExist = await Position.findOne({where:{id:input.positionId}})
        // if(!positionExist) throw new NotFoundError('position not found', {positionId:['position not found']})
        //
        // const permissionExist = await Permissions.findOne({where:{id:input.permissionId}})
        // if(!permissionExist) throw new NotFoundError('not found permission', {permissionId:['not found permission']})
        //
        // if(input.type === 'add'){
        //     const positionPermissionExist = await PositionPermissions.findOne(
        //         {where:
        //                 {permissionId:permissionExist.id,
        //                 positionId:positionExist.id}})
        //     if(positionPermissionExist) throw new ConflictError('you have already had that permission', {permissionId:["you have already had that permission"]})
        //     return PositionPermissions.create({permissionId:permissionExist.id, positionId:positionExist.id})
        // }else{
        //     const positionPermissionExist = await PositionPermissions.findOne(
        //         {where:
        //                 {permissionId:permissionExist.id,
        //                     positionId:positionExist.id}})
        //     if(!positionPermissionExist) throw new ConflictError("you don't that permission", {permissionId:["you don't that permission"]})
        //     await PositionPermissions.destroy({where:{permissionId:permissionExist.id, positionId:positionExist.id}})
        //    return ({} as PositionPermissions)
        // }
        // return Promise.resolve({} as PositionPermissions);

        try {
            await sequelize.query(
                "EXEC ChangePermissionStatus @type = :type, @permissionId = :permissionId, @positionId = :positionId",
                {
                    replacements: {
                        type: input.type,
                        permissionId: input.permissionId,
                        positionId: input.positionId
                    },
                    type: QueryTypes.RAW
                }
            );
        } catch (error) {

            if (error instanceof Error) {
                console.error("Ошибка при выполнении процедуры ChangePermissionStatus:", error.message);

                const sqlError = error as any;
                if (sqlError.message) {
                    // Печатаем содержимое original, чтобы понять, что это за объект
                    console.error("SQL Ошибка:", sqlError.message);

                    if (typeof sqlError.message === 'string') {
                        checkSQLErrorMessage(sqlError.message)
                    }

                } else {
                    throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )
                }
            }

            throw new BaseError("Internal SQL error", 500,"Internal SQL error", error )

        }
    }


    async getPermissions(input: GetPermissions): Promise<Permissions[]> {
       return  await Permissions.findAll({})
    }

    async getPositionPermission(input: GetPositionPermissions): Promise<PositionPermissions[]> {
        const positionExist = await Position.findOne({where:{id:input.positionId}})
        if(!positionExist) throw new NotFoundError('position not found', {positionId:['position not found']})

        return PositionPermissions.findAll({where:{positionId:input.positionId}, include:[{model:Permissions, attributes:['permission', "description"] }]})
    }

}