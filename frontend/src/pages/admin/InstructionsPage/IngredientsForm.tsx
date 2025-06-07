import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import { Plus, Trash2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "react-query";
import { GetProductType } from "@/types/product.ts";
import {useAddInstruction, useDeleteInstruction, useGetInstruction} from "@/api/Instruction.api.ts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useGetMaterial } from "@/api/RawMaterial.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import UpdateInstructionQuantity from "@/pages/admin/InstructionsPage/UpdateInstructionQuantity.tsx";
import DeleteDialogForm from "@/components/admin/units/DeleteDialogForm.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";


type Props = {
    setShowAddForm: (boolean) => void;
    product: GetProductType;
    showAddForm: boolean;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     product: GetProductType[],   status: number }, unknown>>

};

const formSchema = z.object({
    materialId: z.number().min(1, "Please select a material"),  // Change to z.number()
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
});

const IngredientsForm = ({ setShowAddForm, product, showAddForm, refetch }: Props) => {
    const { data, isLoading, refetch: refetchInstruction } = useGetInstruction(product.id);
    const { materials, isLoading: isUnitsLoading } = useGetMaterial();

    const { add, isSuccess, response} = useAddInstruction();
    const {deleteProduct, isSuccess:isInstructionDeleteSuccess, isLoading:isInstructionLoading, data:deleteData} = useDeleteInstruction()

    useEffect(() => {
        if (isInstructionDeleteSuccess && deleteData?.status >= 200 && deleteData?.status < 300) {
            refetchInstruction()
        }
    }, [isInstructionDeleteSuccess]);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("materialId" in response.response.details) {
                form.setError("materialId", {
                    type: "manual",
                    message: response.response.details.name.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response]);

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetchInstruction()
           setShowAddForm(false)
            form.reset()
        }
    }, [isSuccess]);


    const form = useForm<{ materialId: number; quantity: number }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: 0,
            materialId: 0,  // Default to 0 since materialId is a number
        },
    });

    useEffect(() => {
        refetchInstruction();
    }, [product]);

    if (isLoading) return (<div>...isLoading</div>);
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if(materials?.status && (materials.status === 401 || materials.status === 403 ) ) return (<AccessDeniedPage/>)
    if(!data?.instructions || !materials?.material) return (<div>unable to load data</div>)

    const handleAddMaterial = (values: { materialId: number; quantity: number }) => {
        add({ ...values, productId: product.id })
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    Materials for {product.name}
                </h2>
                <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Material
                </Button>
            </div>

            {showAddForm && (
                <div className="p-4 border rounded-lg bg-background shadow-box max-w-[500px]">
                    <h3 className="text-lg font-medium mb-4">Add New Material</h3>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleAddMaterial)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="materialId"
                                render={({ field }) => {
                                    return(
                                    <FormItem>
                                        <FormLabel>Material</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}  // Convert string to number
                                            value={field.value.toString()}  // Ensure value is a string for Select
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a material" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {materials.material.map((material) => (
                                                    <SelectItem key={material.id} value={material.id.toString()}>
                                                        {material.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}}
                            />
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
                                                onChange={(e) =>
                                                    field.onChange(parseFloat(e.target.value))
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}}
                            />
                            <div className="flex gap-2">
                                <Button type="submit">Add Material</Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

            {data.instructions.length !== 0 ? (
                <div className="rounded-md border shadow-box">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Material</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.instructions.map((material) => {
                                return(
                                <TableRow key={material.id}>
                                    <TableCell>{material.raw_material.name}</TableCell>

                                    <TableCell className={''}>
                                        {material.quantity}
                                    </TableCell>

                                    <TableCell>{material.raw_material.unit.name}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <UpdateInstructionQuantity id={material.id}
                                                                       oldQuantity={material.quantity}
                                                refetch={refetchInstruction}/>

                                            <DeleteDialogForm deleteFunction={() => deleteProduct(material.id)}/>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div>You haven't added any materials</div>
            )}
        </>
    );
};

export default IngredientsForm;
