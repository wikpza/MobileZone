export type GetPosition = {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}
export type DeletePositionType = {id:number}
export type CreatePositionType = {name:string}
export type UpdatePositionType = DeletePositionType & CreatePositionType