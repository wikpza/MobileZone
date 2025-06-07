export type Unit = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export type GetUnit = Unit
export type CreateUnitType = {
  name:string,
}

export type UpdateUnitType = {
  name:string,
  id:string,
}