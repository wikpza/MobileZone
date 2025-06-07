export class ProductType{
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly unitId: number,
        public readonly quantity: number,
        public readonly cost: number,
    ) {}
}

export type CreateProductType = {
    name:string,
    unitId:number,
}

export type GetProductsType = {
    searchName?:string,
    page:number,
    limit:number,
    sortBy:string,
}

export type DeleteProductType = {
    id:number
}
export type GetProductType = DeleteProductType

export type UpdateProductType = {
    name:string,
    unitId:number,
    id:number
}

export type SaleProductType = {
    productId:number,
    quantity:number,
    employeeId:number
}

export type GetProductSaleHistoryType = {
    page:number,
    limit:number,
    sortBy:string,
}