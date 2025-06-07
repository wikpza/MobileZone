export class RawMaterialType{
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly unitId: number,
        public readonly quantity: number,
        public readonly cost:number,
) {
    }
}


export type GetRawMaterialsType = {
    searchName?:string,
    page:number,
    limit:number,
    sortBy:string,
}

export type DeleteRawMaterialType = {
    id:number
}

export type GetRawMaterialType = DeleteRawMaterialType

export type CreateRawMaterial = {
    name:string,
    unitId:number,
}
export type UpdateRawMaterialType = CreateRawMaterial & {id:number}