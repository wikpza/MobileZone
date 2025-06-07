import React, {useEffect, useState} from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button.tsx"
import {
  Table,
  TableBody, TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx"
import { Material } from "@/types/material.ts"
import { toast } from "sonner"
import {useDeleteRawMaterial, useGetMaterial} from "@/api/RawMaterial.api.ts";
import {Card} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import CreateRawMaterialForm from "@/pages/admin/RawMaterialPage/CreateRawMaterialForm.tsx";
import UpdateRawMaterialForm from "@/pages/admin/RawMaterialPage/UpdateRawMaterialForm.tsx";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import {useGetUnits} from "@/api/Unit.api.ts";

// Sample data

export default function MaterialsPage() {
  const {materials, isLoading, error, refetch} = useGetMaterial()
  const {deleteMaterial, isSuccess, data} = useDeleteRawMaterial()
  const {units, error:unitsError, isLoading:unitsIsLoading} = useGetUnits()


  useEffect(() => {
    if (isSuccess && data?.status >= 200 && data?.status < 300) {
      refetch()
    }
  }, [isSuccess]);

  if(isLoading) return (<div>...Loading</div>)
  if(!materials?.material ) return (<div>unable to load data</div>)
  if(materials?.status && (materials.status === 401 || materials.status === 403 ) ) return (<AccessDeniedPage/>)

  if(error || unitsError){
    return (
        <div>Unable to load page</div>
    )
  }

  if(isLoading) return (
      <div>
        <Card className={"m-5"}>
          <section>
            <Table>
              <TableCaption>A list of your recent materials.</TableCaption>
              <thead>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
              </thead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 4 }).map((_, index1) => (
                          <TableCell key={index1}><Skeleton className="h-4 w-full" /></TableCell>
                      ))}
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </Card>
      </div>

  )



  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">Raw Materials</h1>

        <CreateRawMaterialForm refetch={refetch} units={units}/>

      </div>

      <div className="rounded-md border shadow-box">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.material.map((material) => (
              <TableRow key={material.id}>
                <TableCell>{material.name}</TableCell>
                <TableCell>{material.unit.name}</TableCell>
                <TableCell>{material.quantity.toFixed(2)}</TableCell>
                <TableCell>{material.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">


                   <UpdateRawMaterialForm refetch={refetch} material={material} units={units}/>

                    <DeleteDialogForm deleteFunction={() =>deleteMaterial(material.id)}/>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {materials.material.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    You haven't added any raw materials
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}