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
import { UnitForm } from "@/components/admin/units/UnitForm.tsx"
import { Unit } from "@/types/unit.ts"
import { toast } from "sonner"
import {useDeleteUnit, useGetUnits} from "@/api/Unit.api.ts";
import {Card} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import AddUnitForm from "@/pages/admin/UnitPage/AddUnitForm.tsx";
import UpdateUnitForm from "@/pages/admin/UnitPage/updateUnitForm.tsx";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

// Sample data


export default function UnitsPage() {
  const {units:data, isLoading , refetch} = useGetUnits()

  const [showForm, setShowForm] = useState(false)
  const {deleteUnit, isSuccess, data: deleteData} = useDeleteUnit()

  useEffect(() => {
    refetch()
  }, [data]);

  useEffect(() => {
    if (isSuccess && deleteData?.status >= 200 && deleteData?.status < 300) {
      refetch()
    }
  }, [isSuccess]);

  if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

  if(isLoading) return (
      <div>
        <Card className={"m-5"}>
          <section>
            <Table>
              <TableCaption>A list of your recent materials.</TableCaption>
              <thead>
              <TableRow>
                <TableHead>Name</TableHead>
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


  const handleDeleteUnit = (id: string) => {
    deleteUnit(id)
  }

  return (
    <div className="space-y-4 max-w-[800px]">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Units of Measurement</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </div>

      {(showForm) && (
         <AddUnitForm setShowForm={setShowForm}  refetch={refetch} />
      )}
      {
        data.units && (
              <div className="rounded-md border shadow-box">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Updated Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.units.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell>{unit.name}</TableCell>
                          <TableCell>{new Date(unit.createdAt).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell>{new Date(unit.updatedAt).toLocaleDateString('ru-RU')}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-4">


                              <UpdateUnitForm refetch={refetch} selectedUnit={unit}/>

                              <DeleteDialogForm deleteFunction={() => handleDeleteUnit(unit.id)}/>


                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                    {data.units.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground">
                            You haven't added any units
                          </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
          )
      }
    </div>
  )
}