import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {GetBudgetHistoryType} from "@/types/budget.ts";

type Props = {
    transactions:GetBudgetHistoryType[] | undefined,
    isLoading:boolean,
    isError:boolean,
}
const TransactionHistoryTable = ({transactions, isError, isLoading}:Props) => {
    if(isLoading) return(<div>...Loading</div>)
    if(isError) return(<div>Error: unable to get data</div>)
    return (
        <Card className={'shadow-box'}>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Recent budget activities</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Employee</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{ new Date(transaction.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{`${transaction.employee.firstName[0]}.${transaction.employee.middleName[0]}.${transaction.employee.lastName}`}</TableCell>
                                <TableCell className={`text-right ${
                                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    ${Math.abs(transaction.amount).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}

                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    You haven't made any transactions
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default TransactionHistoryTable;