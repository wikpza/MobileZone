import React from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {format} from "date-fns";
import {GetLoanPaymentType} from "@/types/loan.ts";

type Props = {
    loanPayment: GetLoanPaymentType[]
}
export default function  LoanPaymentTable ({loanPayment}:Props){
    return (
        <div className="rounded-md border shadow-box">
            <Table>
                <TableCaption className="text-center text-muted-foreground">{loanPayment.length === 0? "You haven't payed any loan" : "Loan repayment history"}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Repayment Date</TableHead>
                        <TableHead>Principal Payment</TableHead>
                        <TableHead>Interest Amount</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Outstanding Loan</TableHead>
                        <TableHead>Overdue Days</TableHead>

                        <TableHead>Penalty</TableHead>
                        <TableHead>Grand Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loanPayment.map((repayment) => (
                        <TableRow key={repayment.id}>
                            <TableCell className="font-medium">{repayment.loanId}</TableCell>
                            <TableCell>{format(repayment.giveDate, "PPP")}</TableCell>
                            <TableCell>${repayment.mainLoan.toFixed(3).replace(/(\.0{1,3})$/, '')}</TableCell>
                            <TableCell>${repayment.procentSumma.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString()}</TableCell>
                            <TableCell>${(repayment.procentSumma + repayment.mainLoan).toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString()}</TableCell>
                            <TableCell>${repayment.OstatokDolga.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString()}</TableCell>
                            <TableCell>{repayment.overdueDay}</TableCell>

                            <TableCell>${repayment.penyaSumma.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString()}</TableCell>
                            <TableCell>${(repayment.mainLoan + repayment.procentSumma + repayment.penyaSumma).toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString()}</TableCell>
                        </TableRow>


                    ))}
                </TableBody>
            </Table>
        </div>
    );
}