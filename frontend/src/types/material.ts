export type Material = {
  id: number
  name: string
  unit: {id:number, name:string}
  quantity: number
  description?: string
  createdAt: Date
  updatedAt: Date
}


export type GetMaterial = {
  id:number,
  name:string,
  unitId:number,
  quantity:number,
  cost:number,
  createdAt:Date,
  updatedAt:Date,
  unit:{
    id:number,
    name:string,
  }
}

export type CreateRawMaterial = {
  name:string,
  unitId:number,
}

export type UpdateRawMaterial = {
  name:string,
  unitId:number,
  id:number,
}