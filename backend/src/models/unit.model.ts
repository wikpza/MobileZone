export class UnitType {
    constructor(
        public readonly is: number,
        public readonly name: string,
    ) {
    }
}

export type GetUnitsType = {
    searchName?:string,
    page:number,
    limit:number,
    sortBy:string,
}
export class DeleteUnitType {
    constructor(
        public readonly id: number,
    ) {
    }
}

export class GetUnitType {
    constructor(
        public readonly id: number,
    ) {
    }
}
export class CreateUnitType {
    constructor(
        public readonly name: string,
    ) {
    }
}

export class UpdateUnitType {
    constructor(
        public readonly name: string,
        public readonly id: number,
    ) {
    }
}
