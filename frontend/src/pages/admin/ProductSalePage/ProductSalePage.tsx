import React, { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Sale } from "@/types/sale"
import { toast } from "sonner"
import ProductSaleHistoryTable from "@/pages/admin/ProductSalePage/ProductSaleHistoryTable.tsx";
import {useGetProductSaleHistory} from "@/api/ProductSale.api.ts";
import SaleProductForm from "@/pages/admin/ProductSalePage/SaleProductForm.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";


export default function SalesPage() {
    const {data, isError, isLoading, refetch} = useGetProductSaleHistory()

    if(isLoading) return (<div>.... Loading</div>)

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!data || !data.productSale) return (<div>unable to load data</div>)


    return (
        <div className="space-y-4">

           <SaleProductForm refetch={refetch}/>


            <ProductSaleHistoryTable productSales={data.productSale} isLoading={isLoading} isError={isError}/>

        </div>
    )
}