import React from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {format} from "date-fns";
import {GetLoanType} from "@/types/loan.ts";


type Props = {
    loans:GetLoanType[]
}

const LoanTable = ({loans}:Props) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "text-blue-600";
            case "paid":
                return "text-green-600";
            case "defaulted":
                return "text-red-600";
            default:
                return "";
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                {loans.length === 0 && (
                        <TableCaption className="text-center text-muted-foreground">
                            You haven't taken any loan
                        </TableCaption>
                )}
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Interest Rate</TableHead>
                        <TableHead>Term (Years)</TableHead>
                        <TableHead>Penalty Rate</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loans.map((loan) => (
                        <TableRow key={loan.id}>
                            <TableCell className="font-medium">{loan.id}</TableCell>
                            <TableCell>${loan.loanSum.toLocaleString()}</TableCell>
                            <TableCell>{loan.procentStavka}%</TableCell>
                            <TableCell>{loan.periodYear}</TableCell>
                            <TableCell>{loan.penyaStavka}%</TableCell>
                            <TableCell>{format(loan.takeDate, "PPP")}</TableCell>
                            <TableCell className={loan.statusFinished? "text-green-600":"text-blue-600"}>
                                {loan.statusFinished? "Paid":"Active"}
                            </TableCell>
                        </TableRow>
                    ))}


                </TableBody>
            </Table>
        </div>
    );
};

export default LoanTable;