export type GetSalaryList = {
    id:number,
    numSoledProduct:number,
    numCreatedProduct:number,
    numBuyMaterial:number,
    employeeId:number,
    employee:{id:number, firstName:number, lastName:number, middleName:number}
    bonus:number,
    salary:number,
    totalSalary:number,
    totalAction:number,
    isGiven:boolean,
    salaryDate:Date,
    createdAt:Date,
    updatedAt:Date
}

export type changeSalaryStatus = {
    id: number,
    employeeId:number,
}

export type ChangeTotalSalary = {
    salary:number,
    id:number
}
export type GetSalaryOption = {
    month:number,
    year:number,
}
export type GenerateSalaryOption = GetSalaryOption