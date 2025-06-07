import React, { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {ProcurementForm} from "@/pages/admin/ProcurementPage/ProcurementForm.tsx";
import PurchaseHistoryTable from "@/pages/admin/ProcurementPage/PurchaseHistoryTable.tsx";
import {useGetPurchaseHistory} from "@/api/Purchase.api.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import MakeReportProcurement from "@/pages/admin/ReportPage/MakeReportProcurement.tsx";


export default function ProcurementPage() {
    const {data:procurements, isError:isGetPurchaseHistoryError, isLoading:isGetPurchaseHistoryLoading, refetch} = useGetPurchaseHistory()
    const [showForm, setShowForm] = useState(false)

    if(isGetPurchaseHistoryLoading) return (<div>.... Loading</div>)
    if(procurements?.status && (procurements.status === 401 || procurements.status === 403 ) ) return (<AccessDeniedPage/>)
    if(!procurements?.purchase) return (<div>unable to load data</div>)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Procurement History</h1>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Procurement
                </Button>
            </div>

            {/*<MakeReportProcurement/>*/}
            {showForm && (
                <div className="bg-card p-4 rounded-lg border shadow-box">
                    <h2 className="text-lg font-semibold mb-4">Add New Procurement</h2>

                    <ProcurementForm
                        onCancel={() => setShowForm(false)}
                        refetch={refetch}
                        setShowForm={setShowForm}
                    />

                </div>
            )}

            <div className="rounded-md border shadow-box">
                <PurchaseHistoryTable procurements={procurements.purchase} isError={isGetPurchaseHistoryError}  isLoading={isGetPurchaseHistoryLoading}/>
            </div>
        </div>
    )
}