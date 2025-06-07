export type Product = {
  id: string
  name: string
  description: string
  price: number
  stock: number
  createdAt: Date
  updatedAt: Date
}

export type GetProductType = {
  id:number,
  name:string,
  unitId: number,
  unit:{name:string, id:number}
  cost: number
  quantity: number
  createdAt: Date
  updatedAt: Date
}

export type CreateProductType = {
  name:string,
  unitId: number,
}

export type UpdateProductType = {
  name:string,
  unitId: number,
  id:number
}


export type GetProductSaleHistoryType = {
  id:number,
  productId:number,
  quantity:number,
  cost:number,
  employeeId:number,
  createdAt:Date,
  updatedAt:Date,
  product:{id:number, name:number, unitId:number, unit:{id:number, name:string}},
  employee:{id:number,firstName:string, middleName:string,lastName:string}
}

export type SaleProductType = {
  productId:number,
  quantity:number,
}