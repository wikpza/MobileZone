import React, {useEffect} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil, Trash2} from "lucide-react";
import {GetEmployeeType} from "@/types/employee.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {GetPosition} from "@/types/position.ts";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import {useDeleteEmployee} from "@/api/Employee.api.ts";
import {useDeletePosition} from "@/api/position.api.ts";
import PositionUpdateForm from "@/pages/admin/PositionPage/PositionUpdateForm.tsx";

type Props = {
    positionList:GetPosition[]
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{
        positions: GetPosition[]
        status: number }, unknown>>
}

const PositionTable = ({refetch, positionList}:Props) => {
    const {deleteData, isSuccess, data } = useDeletePosition()
    useEffect(() => {
        if (isSuccess && data?.status >= 200 && data?.status < 300) {
            refetch()
        }
    }, [isSuccess]);
    return (
        <div className="rounded-md border shadow-box">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead>Updated Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {positionList.map((position) => (
                        <TableRow key={position.id}>
                            <TableCell>{position.name}</TableCell>
                            <TableCell>{ new Date(position.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                            <TableCell>{new Date(position.updatedAt).toLocaleDateString('ru-RU')}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <PositionUpdateForm refetch={refetch} position={position}/>
                                    <DeleteDialogForm deleteFunction={()=>deleteData(position.id.toString())}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                {positionList.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                            You haven't added any employees
                        </TableCell>
                    </TableRow>
                )}
            </Table>
        </div>
    );
};

export default PositionTable;