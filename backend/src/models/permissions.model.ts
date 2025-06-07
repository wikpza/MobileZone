

export type GetPermissions = {

}
export type ChangePermissionStatus = {
    type: string,
    positionId:number,
    permissionId:number
}

export type GetPositionPermissions = {
    positionId?:number
}