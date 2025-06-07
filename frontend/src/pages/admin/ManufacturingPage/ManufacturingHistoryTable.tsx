import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {GetManufacturingHistoryType} from "@/types/manufacturing.ts";


type Props = {
    manufactured:GetManufacturingHistoryType[] | undefined,
    isLoading:boolean,
    isError:boolean
}
const ManufacturingHistoryTable = ({manufactured, isError, isLoading}:Props) => {
    if(isLoading) return(<div>...Loading</div>)
    if(isError) return(<div>Error: unable to get purchase history</div>)
    console.log(manufactured)
    return (
        <div className="rounded-md border shadow-box">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {manufactured.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                            </TableCell>

                            <TableCell>{item.product.name}</TableCell>
                            <TableCell>{`${item.employee.firstName[0]}.${item.employee.middleName[0]}.${item.employee.lastName}`}</TableCell>
                            <TableCell >{item.quantity}</TableCell>
                            <TableCell >{item.product.unit.name}</TableCell>
                        </TableRow>
                    ))}
                    {manufactured.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                No manufacturing history yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ManufacturingHistoryTable;