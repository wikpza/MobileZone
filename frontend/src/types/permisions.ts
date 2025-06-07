export type GetPermissionsList = {
    id:number,
    permission:string,
    createdAt:Date,
    updatedAt:Date,
    description:string
}

export type GetPositionPermission = {
    id:number,
    positionId:number,
    permissionId:number,
    createdAt:Date,
    updatedAt:Date,
    permission:{
        permission:string,
        description:string,
    }

}

export type UpdatePositionPermission = {
    positionId:number,
    permissionId:number,
    type:string,
}
