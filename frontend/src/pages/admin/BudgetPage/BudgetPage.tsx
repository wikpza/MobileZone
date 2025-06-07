import CurrentBalance from "@/pages/admin/BudgetPage/CurrentBalance.tsx";
import {useAddBudget, useGetBudget, useGetBudgetHistory, useUpdateBonus, useUpdateMarkUp} from "@/api/budget.api.ts";
import AddBudgetForm from "@/pages/admin/BudgetPage/addBudgetForm.tsx";
import TransactionHistoryTable from "@/pages/admin/BudgetPage/TransactionHistoryTable.tsx";
import React, {useEffect} from "react";
import MarkUpDetails from "@/pages/admin/BudgetPage/MarkUpDetails.tsx";
import UpdateBonus from "@/pages/admin/BudgetPage/UpdateBonusDetails.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";



export default function BudgetPage() {
    const {data:employerBudget, isLoading:isGetBudgetLoading, refetch:budgetRefetch, isError:isGetBudgetError} = useGetBudget()
    const {data:transactions, isLoading:isGetBudgetHistoryLoading, isError:isGetBudgetHistoryError, refetch:budgetHistoryRefetch} = useGetBudgetHistory()
    const {increaseBudget, isSuccess, response:data} = useAddBudget()

    const {updateItem, isSuccess:isUpdateSuccess, response:updateData } = useUpdateMarkUp()
    const {updateItem:updateBonus, isSuccess:isUpdateBonusSuccess, response:updateResponse} = useUpdateBonus()

    useEffect(() => {
        if (isSuccess && data?.status >= 200 && data?.status < 300) {
            budgetRefetch()
            budgetHistoryRefetch()
        }

        if (isUpdateSuccess && updateData?.status >= 200 && updateData?.status < 300) {
            budgetRefetch()
        }

        if (isUpdateBonusSuccess && updateResponse?.status >= 200 && updateResponse?.status < 300) {
            budgetRefetch()
        }

    }, [isSuccess, isUpdateSuccess, isUpdateBonusSuccess]);


    if(isGetBudgetLoading) return (<div>.... Loading</div>)

    if(employerBudget?.status && (employerBudget.status === 401 || employerBudget.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!employerBudget || !employerBudget.budget) return (<div>unable to load data</div>)

    if(isGetBudgetHistoryLoading) return (<div>.... Loading</div>)

    if(transactions?.status && (transactions.status === 401 || transactions.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!transactions || !transactions.budgetHistory) return (<div>unable to load data</div>)

    return (
        <div className="space-y-6 p-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-rows-2 lg:grid-cols-2 xl:grid-rows-1 xl:grid-cols-3">
                {/* Current Balance Card */}
                <CurrentBalance amount={employerBudget?.budget.amount || 0} isLoading={isGetBudgetLoading} isError={isGetBudgetError}/>

                {/* Add Funds Card */}
                <Card className={'shadow-box '}>
                    <MarkUpDetails markUp={employerBudget?.budget.markUp} updateItem={updateItem} isSuccess={isUpdateSuccess} response={updateData}/>
                    <Separator className={'w-[90%] h-[1px] bg-gray-500 mx-auto'}/>
                    <UpdateBonus bonus={employerBudget?.budget.bonus} updateItem={updateBonus} isSuccess={isUpdateBonusSuccess} response={updateResponse}/>
                </Card>

                <AddBudgetForm addBudget={increaseBudget} response={data} isSuccess={isSuccess}/>


            </div>

            {/* Transaction History */}
            <TransactionHistoryTable transactions={transactions.budgetHistory} isLoading={isGetBudgetHistoryLoading} isError={isGetBudgetHistoryError}/>
        </div>
    )
}