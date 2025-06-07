import EmployeeCreateForm from "@/pages/admin/EmployeePage/EmployeeCreateForm.tsx";
import {useGetDirector, useGetEmployee} from "@/api/Employee.api.ts";
import EmployeeTable from "@/pages/admin/EmployeePage/EmployeeTable.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import React from "react";




export default function EmployeesPage() {
    const {data, isLoading, refetch} = useGetEmployee()
    const {data:director, isLoading:idDirectroLoading, refetch:directorRefetch} = useGetDirector()

    if(isLoading || idDirectroLoading) return (<div>.... Loading</div>)


    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!data || !data.employees ) return (<div>unable to load data</div>)

    if(!director ) return (<div>unable to load data</div>)

    return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Employees</h1>
           <EmployeeCreateForm refetch={refetch}/>
          </div>

        <EmployeeTable employeeList={data.employees} refetch={()=>{
            refetch()
            directorRefetch()
        }} directorId={director?.employees.id}/>

        </div>
  )
}