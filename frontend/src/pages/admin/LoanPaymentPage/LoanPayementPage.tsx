
import React, {useEffect, useState} from "react";
import LoanPaymentTable from "@/pages/admin/LoanPaymentPage/LoanPaymentTable.tsx";
import {useGetLoan, useGetLoanPayment} from "@/api/loan.api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import CreateLoanPaymentDialog from "@/pages/admin/LoanPaymentPage/CreateLoanPaymentDialog.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";




export default function LoanRepaymentPage() {
    const [selectedLoan, setSelectedLoan] = useState<number>()
    const {data:loanList, isLoading:isGetLoanLoading} =  useGetLoan()
    const {data, isLoading, refetch} = useGetLoanPayment(selectedLoan?selectedLoan.toString(): "")

    useEffect(() => {
        refetch()
    }, [selectedLoan]);


    if(isLoading || isGetLoanLoading) return (<div>...Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    console.log(data)
    if(!data?.payment || !loanList) return (<div>unable to load data</div>)


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Loan Repayment</h1>
                    <p className="text-muted-foreground">
                        Record loan repayments and view repayment history
                    </p>
                </div>
                {/* dialog*/}
                <CreateLoanPaymentDialog refetch={refetch} loanList={loanList.loans}/>
            </div>

            <div className="shadow-box min-w-[150px] max-w-[300px]  py-2 px-4 border-gray-300 border rounded-2xl ">
                    <Select
                            onValueChange={(value) => setSelectedLoan(Number(value))}
                    >
                        <SelectTrigger id="month-select"

                        >
                            <SelectValue placeholder="Select loan"/>
                        </SelectTrigger>
                        <SelectContent>
                            {loanList.loans.map((m) => (
                                <SelectItem key={m.id} value={m.id.toString()}>
                                    {`ID: ${m.id}; Amount: ${m.loanSum}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
            </div>

            {/*   table page*/}
            <LoanPaymentTable loanPayment={data.payment}/>
        </div>
    );
}
