import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {useGetMaterial} from "@/api/RawMaterial.api.ts";
import React, {useEffect} from "react";
import {useMakeRawMaterialPurchase} from "@/api/Purchase.api.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {GetPurchaseType, MakeRawMaterialPurchaseType} from "@/types/purchase.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";


const formSchema = z.object({
    materialId: z.number().int().min(0, "materialId must be a positive integer greater than or equal to 1"),
    quantity: z.number().gt(0, "Quantity must be a positive number greater than 0"), // Положительное вещественное число
    cost: z.number().gt(0, "Cost must be a positive number greater than 0"), // Положительное вещественное числ
})

type ProcurementFormProps = {
    onCancel?: () => void,
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     purchase?: GetPurchaseType[],     status: number }, unknown>>
    setShowForm:(value:boolean)=>void
}

export function ProcurementForm({  onCancel, refetch, setShowForm }: ProcurementFormProps) {
    const {materials, isLoading:isGetMaterialLoading, isError:isGetMaterialError} = useGetMaterial()
    const {response, createRawMaterial, isSuccess} = useMakeRawMaterialPurchase()

    const form = useForm<MakeRawMaterialPurchaseType>({
        resolver: zodResolver(formSchema),
    })

    useEffect(() => {
        if(isSuccess && response  && response?.status === 201) {
            refetch()
            setShowForm(false)
            form.reset()
        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >=400 && response?.status < 500) {
            if ("cost" in response.response.details) {
                form.setError("cost", {
                    type: "manual",
                    message: response.response.details.cost.join(","),
                });
            }else {
                toast.error(response.response.message);
            }

        }
    }, [response, form]);

    if(isGetMaterialLoading) return(<div>...Loading</div>)
    if(materials?.status && (materials.status === 401 || materials.status === 403 ) ) return (<div className={"text-red-700"}>You don't have permission to buy raw material</div>)
    if(!materials?.material) return(<div>Error: unable to load raw materials</div>)

    const handleSubmit = (values: MakeRawMaterialPurchaseType) => {
        // Преобразуем поля, чтобы они точно были числами (если вдруг они строковые)
        createRawMaterial(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                <FormField
                    control={form.control}
                    name="materialId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Raw Material</FormLabel>
                            <Select onValueChange={(value) => field.onChange(Number(value))}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select material" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {materials.material.map((material) => (
                                        <SelectItem key={material.id} value={material.id.toString()}>
                                            {material.name}({material.unit.name})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="100"
                                    {...field}
                                    onBlur={() => field.onChange(Number(field.value))} // Преобразуем значение в число
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="1000"
                                    {...field}
                                    onBlur={() => field.onChange(Number(field.value))} // Преобразуем значение в число
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit">Add Procurement</Button>
                </div>
            </form>
        </Form>
    )
}
