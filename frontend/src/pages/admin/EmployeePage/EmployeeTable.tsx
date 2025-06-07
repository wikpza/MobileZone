import React, {useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2} from "lucide-react";
import {GetEmployeeType} from "@/types/employee.ts";
import UpdateEmployeeForm from "@/pages/admin/EmployeePage/UpdateEmployeeForm.tsx";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import {useDeleteEmployee, useSetDirector} from "@/api/Employee.api.ts";
import UpdateEmployeeDataDialog from "@/pages/admin/EmployeePage/UpdateEmployeeDataDialog.tsx";

type Props = {
    employeeList:GetEmployeeType[],
    directorId:number | null
    refetch: ()=>void

}
const EmployeeTable = ({employeeList, refetch, directorId}:Props) => {
    const {deleteEmployee, isSuccess, data } = useDeleteEmployee()

    const {response, create:selectDirector, isSuccess:isSelectSuccess} = useSetDirector()

    useEffect(() => {
        if (isSuccess && data?.status >= 200 && data?.status < 300) {
            refetch()
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isSelectSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
        }
    }, [isSelectSuccess]);

    return (
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
                    {employeeList.map((employee) => (
                        <TableRow key={employee.id}>
                            <TableCell>{employee.id}</TableCell>
                            <TableCell>{`${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName}`}</TableCell>
                            <TableCell>{employee.position.name}</TableCell>
                            <TableCell>{employee.phone}</TableCell>
                            <TableCell>{employee.salary}$</TableCell>
                            <TableCell>{employee.address}</TableCell>

                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        disabled={employee.id === directorId}
                                        onClick={()=>selectDirector({employeeId:employee.id})}
                                        // variant="ghost"
                                        // size="icon"
                                    >
                                       Set Director
                                    </Button>
                                   <UpdateEmployeeForm refetch={refetch} employee={employee}/>
                                    <UpdateEmployeeDataDialog refetch={refetch} id={employee.id}/>
                                    <DeleteDialogForm deleteFunction={()=>deleteEmployee(employee.id.toString())}/>

                                </div>

                            </TableCell>
                        </TableRow>
                    ))}

                    {employeeList.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                You haven't added any employees
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default EmployeeTable;