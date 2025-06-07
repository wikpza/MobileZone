import {useGetPositions} from "@/api/position.api.ts";
import PositionCreateForm from "@/pages/admin/PositionPage/PositionCreateForm.tsx";
import PositionTable from "@/pages/admin/PositionPage/PositionTable.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import React from "react";

export default function PositionsPage() {
  const {data, isLoading, refetch} = useGetPositions()

  if(isLoading) return (<div>.... Loading</div>)
  if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
  if(!data) return (<div>unable to load data</div>)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Positions</h1>

        <PositionCreateForm refetch={refetch}/>

      </div>
      <PositionTable refetch={refetch} positionList={data.positions}/>

    </div>
  )
}