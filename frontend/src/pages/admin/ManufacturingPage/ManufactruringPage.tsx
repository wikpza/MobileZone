
import ManufacturingHistoryTable from "@/pages/admin/ManufacturingPage/ManufacturingHistoryTable.tsx";
import {useGetProductManufacturing} from "@/api/manufacturing.api.ts";
import MakeManufacturingDialog from "@/pages/admin/ManufacturingPage/MakeManufacturingDialog.tsx";
import React, {useState} from "react";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import MakeReportManufacturing from "@/pages/admin/ReportPage/MakeReportManufacturing.tsx";


export default function ManufacturingPage() {
    const {data, isLoading, isError, refetch} = useGetProductManufacturing()


    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!data?.manufacturing  ) return (<div>Error: unable to  load page</div>)


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manufacturing</h1>
                <MakeManufacturingDialog refetch={refetch}  />
            </div>
        {/*<MakeReportManufacturing/>*/}

        <ManufacturingHistoryTable manufactured={data.manufacturing} isLoading={isLoading} isError={isError}/>
        </div>
    )
}

