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
import { Product } from "@/types/product.ts"
import { toast } from "sonner"
import {useDeleteProduct, useGetProduct} from "@/api/Product.api.ts";
import {Card} from "@/components/ui/card.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import CreateProductForm from "@/pages/admin/ProductPage/CreateProductForm.tsx";
import UpdateProductForm from "@/pages/admin/ProductPage/UpdateProductForm.tsx";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import {useGetUnits} from "@/api/Unit.api.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

export default function ProductsPage() {
  const {data:products, refetch, isLoading, error} = useGetProduct()
  const {deleteProduct, isSuccess, data} = useDeleteProduct()
  const {units, isLoading:isUnitsLoading, error:isUnitError} = useGetUnits()

  useEffect(() => {
    if (isSuccess && data?.status >= 200 && data?.status < 300) {
      refetch()
    }
  }, [isSuccess]);

  if(products?.status && (products.status === 401 || products.status === 403 ) ) return (<AccessDeniedPage/>)
  // if(units?.status && (units.status === 401 || units.status === 403 ) ) return (<AccessDeniedPage/>)

  if(isLoading || isUnitsLoading) return (
      <div>
        <Card className={"m-5"}>
          <section>
            <Table>
              <TableCaption>A list of your recent materials.</TableCaption>
              <thead>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
    <div className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
       <CreateProductForm refetch={refetch} units={units}/>
      </div>

      <div className="rounded-md border shadow-box">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.product.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity.toFixed(2)}</TableCell>
                <TableCell>{product.unit.name}</TableCell>
                <TableCell>${product.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                   <UpdateProductForm refetch={refetch} product={product} units={units}/>


                    <DeleteDialogForm deleteFunction={() => deleteProduct(product.id)}/>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {products.product.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    You haven't added any products
                  </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}