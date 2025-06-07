import LoanTable from "@/pages/admin/LoanPage/LoanTable.tsx";
import {useGetLoan} from "@/api/loan.api.ts";
import CreateLoanDialog from "@/pages/admin/LoanPage/CreateLoanDialog.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import React from "react";

export default function LoansPage() {
    const {data, isLoading:isGetLoanLoading, refetch} =  useGetLoan()

    if(isGetLoanLoading) return (<div>...Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if(!data) return (<div>Unable to load loan</div>)





    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Loans Management</h1>
                    <p className="text-muted-foreground">
                        Manage loans, view loan history, and create new loans
                    </p>
                </div>

            {/*    dialog*/}
                <CreateLoanDialog refetch={refetch}/>
            </div>

        {/*   rable*/}
            <LoanTable loans={data.loans}/>
        </div>
    );
}
