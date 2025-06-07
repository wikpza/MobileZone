
export type GetPositionsType = {
    searchName?:string,
    page:number,
    limit:number,
    sortBy:string,
}
export class DeletePositionType {
    constructor(
        public readonly id: number,
    ) {
    }
}

export type GetPositionType = {
    page:number,
    limit:number,
    sortBy:string,
}
export class CreatePositionType {
    constructor(
        public readonly name: string,
    ) {
    }
}

export class UpdatePositionType {
    constructor(
        public readonly name: string,
        public readonly id: number,
    ) {
    }
}
