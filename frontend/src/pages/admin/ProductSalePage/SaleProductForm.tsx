import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import * as z from 'zod'
import {useForm} from "react-hook-form";
import {GetProductSaleHistoryType, SaleProductType} from "@/types/product.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useGetProduct} from "@/api/Product.api.ts";
import {useSaleProduct} from "@/api/ProductSale.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

const formSchema = z.object({
    productId:z.number().min(1, "please select a product"),
    quantity: z.number().min(0.001, "Please select a position"),
})

type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     productSale: GetProductSaleHistoryType[] ,    status: number }, unknown>>
}
const SaleProductForm = ({refetch}:Props) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const {data, isLoading, isError} = useGetProduct()
    const {saleProduct, response, isSuccess} = useSaleProduct()

    const form = useForm<SaleProductType>({
        resolver:zodResolver(formSchema),
        defaultValues:{productId:0, quantity:0}
    })

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
            setIsDialogOpen(false)
            form.reset()
        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("quantity" in response.response.details) {
                form.setError("quantity", {
                    type: "manual",
                    message: response.response.details.quantity.join(","),
                });
            }else if("productId" in response.response.details){
                form.setError("productId", {
                    type: "manual",
                    message: response.response.details.productId.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response]);


    if(isLoading) return (<div>...Loading</div>)
    if(!data?.product ) return (<div className={'text-red-700'}> don't have access to sale</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (
        <div className={'flex justify-between items-center'}>
            <h1 className="text-3xl font-bold">Product Sales</h1>


        </div>

    )
    if (data?.product.length === 0) return (<div className={'text-red-700'}>before selling add product</div>)


    const handleSaleProduct = (values: SaleProductType) => {
        saleProduct(values)
    };

    return (
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Product Sales</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={()=>setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4"/> Add Sale
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Sale</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSaleProduct)}
                        >
                            <div className="space-y-4 py-4">

                                <FormField control={form.control} render={({field}) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(Number(value))
                                                }
                                                }

                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a material"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {data.product.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )
                                }} name={'productId'}/>


                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({field}) => {

                                        return (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(parseFloat(e.target.value))
                                                        }
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />


                                <Button className="w-full">
                                    Create Sale
                                </Button>
                            </div>
                        </form>
                    </Form>

                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SaleProductForm;