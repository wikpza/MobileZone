import React from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {GetPurchaseType} from "@/types/purchase.ts";

type Props = {
    procurements:GetPurchaseType[] | undefined,
    isLoading:boolean,
    isError:boolean
}
const PurchaseHistoryTable = ({procurements, isError, isLoading}:Props) => {
    if(isLoading) return(<div>...Loading</div>)
    if(isError) return(<div>Error: unable to get purchase history</div>)
    return (
        <Table>
            {procurements && procurements.length === 0 && <TableCaption>You haven't make any purchases.</TableCaption>}
            <TableHeader>
                <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Cost</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {procurements.map((procurement) => (
                    <TableRow key={procurement.id}>
                        <TableCell>{procurement.raw_material.name}</TableCell>
                        <TableCell>
                            {procurement.quantity} {procurement.raw_material.unit.name}
                        </TableCell>
                        <TableCell>
                            {new Date(procurement.createdAt).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>{`${procurement.employee.firstName[0]}.${procurement.employee.middleName[0]}.${procurement.employee.lastName}`}</TableCell>
                        <TableCell>${procurement.cost.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PurchaseHistoryTable;