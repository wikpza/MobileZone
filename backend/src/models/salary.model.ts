export type GenerateSalaryListType = {
    month:number
    year:number
}

export type GetSalaryListType = {
    month:number,
    year:number,

    page:number,
    limit:number,
    sortBy:string,
}
export type ChangeStatusType = {
    id:number
    employeeId:number
}

export type ChangeSalary = {
    salary:number,
    id:number
}
export type GiverSalaryType = {
    month:number,
    year:number,
    employeeId:number
}