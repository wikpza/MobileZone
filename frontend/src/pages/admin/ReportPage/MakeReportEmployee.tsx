import React, {useState} from 'react';
import {Input} from "@/components/ui/input.tsx";
import DialogReportManufacturing from "@/pages/admin/ReportPage/DialogReportManufacturing.tsx";
import {useGetEmployee} from "@/api/Employee.api.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import UpdateEmployeeForm from "@/pages/admin/EmployeePage/UpdateEmployeeForm.tsx";
import UpdateEmployeeDataDialog from "@/pages/admin/EmployeePage/UpdateEmployeeDataDialog.tsx";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import DialogReportEmployee from "@/pages/admin/ReportPage/DialogReportEmployee.tsx";
import {GetEmployeeType} from "@/types/employee.ts";

type Props = {
    signature:{name:string, position:string},
    employee:GetEmployeeType
}
const MakeReportEmployee = ({signature}:Props) => {
    const {data, isLoading, refetch} = useGetEmployee()
    if(isLoading) return (<div>.... Loading</div>)

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!data || !data.employees) return (<div>unable to load data</div>)


    return (
        <div>


            <div>
                <div className="rounded-md border shadow-box">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Phone number</TableHead>
                                <TableHead>Salary</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.id}</TableCell>
                                    <TableCell>{`${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName}`}</TableCell>
                                    <TableCell>{employee.position.name}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                    <TableCell>{employee.salary}$</TableCell>
                                    <TableCell>{employee.address}</TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">

                                            <DialogReportEmployee
                                               signature={signature} employeeId={employee.id}
                                            employee={employee}/>

                                        </div>

                                    </TableCell>
                                </TableRow>
                            ))}

                            {data.employees.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        You haven't added any employees
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default MakeReportEmployee;
