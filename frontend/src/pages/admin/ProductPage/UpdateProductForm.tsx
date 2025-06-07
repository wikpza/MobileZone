import React, {useEffect} from "react";
import {useForm, FormProvider} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog.tsx";
import {Pencil} from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form.tsx";
import {GetUnit} from "@/types/unit.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {GetProductType} from "@/types/product.ts";
import {useUpdateProduct} from "@/api/Product.api.ts";


// Схема валидации для формы с использованием Zod
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    unitId: z.number().min(1, "Please select a unit"),
});

type FormData = {
    name: string;
    unitId: number;
};

type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     product: GetProductType[] ,    status: number }, unknown>>
    product:GetProductType,
    units: {     units?: GetUnit[],    status: number } | undefined
}
const MyForm = ({refetch, product, units}:Props) => {
    const {update, isSuccess, response} = useUpdateProduct()

    const [open, setOpen] = React.useState(false);
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues:{name:product.name, unitId:product.unit.id}
    });


    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if(isSuccess && response  && response?.status === 201) {
            refetch()
            setOpen(false)
        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >=400 && response?.status < 500) {
            if ("name" in response.response.details) {
                methods.setError("name", {
                    type: "manual",
                    message: response.response.details.name.join(","),
                });
            }else if  ("unitId" in response.response.details) {
                methods.setError("unitId", {
                    type: "manual",
                    message: response.response.details.name.join(","),
                });
            }else {

                toast.error(response.response.message)
            }


        }
    }, [response, methods]);

    if(units?.status && (units.status === 401 || units.status === 403 ) ) return (<></>)
    if(!units?.units) return(<div>unable to load units list</div>)

    if(units.units.length === 0) {
        return (
            <div>before adding product, add unit</div>
        )
    }

    const onSubmit = (data: FormData) => {
        if(data.name === product.name && data.unitId === product.unit.id ){
            methods.setError("name", {
                type: "manual",
                message:"You haven't changed anything ",
            });

            methods.setError("unitId", {
                type: "manual",
                message:"You haven't changed anything ",
            });

        }else{
            update({...data, id:product.id})
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={'flex items-center justify-center  p-3 rounded-2xl'}>
                <Pencil className="h-4 w-4" />
            </DialogTrigger>

            <DialogContent>
                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Update Product</h2>

                    {/* Обернули в FormProvider, чтобы передать контекст */}
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name Input */}
                            <FormField name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id="name"
                                            placeholder="Enter material name"
                                            className="border p-2 rounded w-full"
                                        />
                                    </FormControl>
                                    {methods.formState.errors.name && (
                                        <FormMessage>{methods.formState.errors.name.message}</FormMessage>
                                    )}
                                </FormItem>
                            )} />

                            {/* Unit Input */}
                            <FormField name="unitId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="unitId">Unit</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            id="unitId"
                                            className="border p-2 rounded w-full"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        >
                                            <option value="">Select unit</option>
                                            {units.units.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    {methods.formState.errors.unitId && (
                                        <FormMessage>{methods.formState.errors.unitId.message}</FormMessage>
                                    )}
                                </FormItem>
                            )} />


                            {/* Submit Button */}
                            <div className="flex justify-end gap-2">
                                <Button type="submit">Save Item</Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MyForm;
