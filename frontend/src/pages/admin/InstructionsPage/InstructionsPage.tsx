import React, {useEffect, useState} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IngredientsForm from "@/pages/admin/InstructionsPage/IngredientsForm.tsx";
import { useGetProduct } from "@/api/Product.api.ts";
import { GetProductType } from "@/types/product.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

export default function InstructionsPage() {

  const { data, isLoading, refetch } = useGetProduct();
  const [selectedProduct, setSelectedProduct] = useState<GetProductType>();
  const [showAddForm, setShowAddForm] = useState(false);



    useEffect(() => {
        refetch()
    }, [data]);

    if(isLoading) return (<div>....Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if(!data?.product) return (<div>Unable to load data</div>)


    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manufacturing Instructions</h1>
        </div>

        <div className="w-full max-w-xs">
          <Select
              value={selectedProduct?.id.toString() || ""}
              onValueChange={(value) => {
                const findProduct = data.product.find((product) => product.id.toString() === value);
                setSelectedProduct(findProduct);
                setShowAddForm(false);
              }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {data.product.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedProduct && (
            <IngredientsForm
                setShowAddForm={setShowAddForm}
                product={selectedProduct}
                showAddForm={showAddForm}
                refetch={refetch}
            />
        )}
      </div>
  );
}
