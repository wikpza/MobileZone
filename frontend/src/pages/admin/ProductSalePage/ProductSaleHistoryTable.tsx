import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

import {GetProductSaleHistoryType} from "@/types/product.ts";
type Props = {
    productSales:GetProductSaleHistoryType[] | undefined,
    isLoading:boolean,
    isError:boolean,
}
const ProductSaleHistoryTable = ({productSales, isError, isLoading}:Props) => {
    if(isLoading) return(<div>...Loading</div>)
    if(isError) return(<div>Error: unable to get data</div>)

    return (
        <div className="rounded-md border shadow-box">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead >Sale Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className={'text-end'}>Total Amount</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productSales.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{sale.product.name}</TableCell>
                            <TableCell>{sale.quantity} {sale.product.unit.name}</TableCell>
                            <TableCell  >{ new Date(sale.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                            <TableCell>{`${sale.employee.firstName[0]}.${sale.employee.middleName[0]}.${sale.employee.lastName}`}</TableCell>
                            <TableCell className={'text-end'}>${sale.cost.toFixed(2)}</TableCell>

                        </TableRow>
                    ))}

                    {productSales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                You haven't soled anything
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>
            </Table>
        </div>
    );
};

export default ProductSaleHistoryTable;