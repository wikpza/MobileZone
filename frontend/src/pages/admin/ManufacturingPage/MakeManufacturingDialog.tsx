import React, {useEffect, useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import * as z from "zod";
import {GetManufacturingHistoryType, MakeProductManufacturingType} from "@/types/manufacturing.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useGetInstruction} from "@/api/Instruction.api.ts";
import {MakeManufacturing} from "@/api/manufacturing.api.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import {useGetProduct} from "@/api/Product.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";


const formSchema  = z.object({
    productId:z.number().min(1, "please select a product"),
    quantity:z.number().min(0.01, "Quantity must be a greater than 0")

})
type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     manufacturing?: GetManufacturingHistoryType[]   ,  status: number }, unknown>>

}
const MakeManufacturingDialog = ({refetch}:Props) => {
    const form = useForm<MakeProductManufacturingType>({
        resolver:zodResolver(formSchema),
         defaultValues:{productId:0, quantity:0}
    })

    const {create, isLoading, isSuccess, response} = MakeManufacturing()
    const [isChange, setIsChange] = useState<boolean>(false)
    const [open, setOpen] = React.useState(false);
    const {data:instruction, isLoading:isGetInstructionLoading, refetch:refetchInstruction, isError:isInstructionError} = useGetInstruction(form.getValues('productId'))
    const {data:products, isLoading:isProductLoading, error:productError} = useGetProduct()

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
            setOpen(false)
            form.reset()

        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && response?.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
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
            }else if ("employeeId" in response.response.details) {
            form.setError("employeeId", {
                type: "manual",
                message: response.response.details.employeeId.join(","),
            });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response]);

    useEffect(() => {
        refetchInstruction()
    }, [form.getValues('productId')]);

    useEffect(() => {
    }, [isChange]);

    if(instruction?.status && (instruction.status === 401 || instruction.status === 403 ) ) return(<div></div>)
    if(!instruction?.instructions ) return (<div>Error: unable to  load page</div>)

    if(products?.status && (products.status === 401 || products.status === 403 ) ) return(<div></div>)

    if(!instruction?.instructions || !products?.product ) return (<div>Error: unable to  load page</div>)

    if(products.product.length === 0 ) return(<div>Add Products, before manufacturing</div>)

    const handleAddMaterial = (values: MakeProductManufacturingType) => {
        if(instruction.instructions.length === 0 ){
            form.setError("productId", {
                type: "manual",
                message: "Unable to create product, because you haven't added raw materials to instruction",
            });
            return
        }
        create(values)
    };

    function hasArrayProperty<T>(obj: T, key: keyof T): obj is T & { [K in keyof T]: unknown[] } {
        return Array.isArray(obj[key]);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Manufacture Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Manufacture New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleAddMaterial)}>
                            <div className={'space-y-4'}>


                                <FormField control={form.control} render={({field})=>{
                                    return(
                                        <FormItem>
                                            <FormLabel>Product</FormLabel>
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(Number(value))
                                                    setIsChange(!isChange)
                                                }
                                            }


                                                value={field.value.toString()}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a material" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.product.map((product) => (
                                                        <SelectItem key={product.id} value={product.id.toString()}>
                                                            {product.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }} name={'productId'}/>


                                {hasArrayProperty(instruction, "instructions") && instruction.instructions.length === 0 && <div>Before Manufacturing, add raw materials</div>}
                                {instruction && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Required Materials</Label>
                                            <div className="border rounded-lg p-4 space-y-2">

                                                {instruction &&
                                                    <Table>
                                                    <TableBody>
                                                    {hasArrayProperty(instruction, "instructions")  && instruction?.instructions.map((material) => {
                                                        const price = material.raw_material.cost / material.raw_material.quantity
                                                        return(
                                                                <TableRow key = {material.id}>
                                                                    <TableCell>
                                                                        {material.raw_material.name}
                                                                    </TableCell>

                                                                    {
                                                                        (material.raw_material.cost === 0)?
                                                                            <TableCell  className={'text-center text-red-700'}>
                                                                                add items
                                                                            </TableCell>
                                                                            :
                                                                            <TableCell className={'text-center'}>
                                                                                {`$${form.getValues('quantity')>0? parseFloat((price * material.quantity * form.getValues('quantity')).toFixed(2)): parseFloat((price *material.quantity).toFixed(2))}`}
                                                                            </TableCell>
                                                                    }

                                                                    <TableCell className={'text-end'}>
                                                                        {`${form.getValues('quantity')>0? `${material.quantity} ${material.raw_material.unit.name} x ${form.getValues('quantity')}` : `${material.quantity} ${material.raw_material.unit.name}` } `}
                                                                    </TableCell>




                                                                </TableRow>

                                                            // <div key={material.id}
                                                            //      className="flex justify-between items-center">
                                                            //     <div className={'text-left'}>{material.raw_material.name}</div>
                                                            //     <div  className={'text-center'}></div>
                                                            //
                                                            //     <div className={'text-end'}>{`$${form.getValues('quantity')>0? parseFloat((price * material.quantity * form.getValues('quantity')).toFixed(2)): parseFloat((price *material.quantity).toFixed(2))}`}</div>
                                                            // </div>
                                                        )}
                                                    )}
                                                    </TableBody>
                                                    </Table>

                                                }

                                            </div>
                                        </div>

                                    </div>
                                )}

                                {isGetInstructionLoading && <div>...Loading instruction</div>}


                                <FormField
                                    control={form.control}
                                    name="quantity"
                                    render={({ field }) =>{

                                        return(
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(parseFloat(e.target.value))
                                                            setIsChange(!isChange)
                                                        }
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}}
                                />

                                <Button  className="w-full">
                                    Start Manufacturing
                                </Button>

                            </div>
                        </form>
                    </Form>






                </div>
            </DialogContent>


        </Dialog>
    );
};

export default MakeManufacturingDialog;