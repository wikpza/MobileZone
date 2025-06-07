export type Instruction = {
  id: number
  productId: number
  productName: string
  materials: {
    materialId: number
    name: string
    quantity: number
    unit: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export type AddInstruction ={
  productId:number,
  materialId:number,
  quantity:number
}

export type UpdateInstructionQuantity={
  quantity:number,
  id:number
}
export type GetInstruction = {
  id:number,
  productId:number,
  rawMaterialId:number,
  quantity:number,
  createdAt:Date,
  updatedAt:Date,
  raw_material:{
    id:number,
    name:string,
    unitId:number,
    quantity:number,
    cost:number,
    unit:{
      id:number,
      name:string,
    }
  }
}