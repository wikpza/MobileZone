import React, {useEffect} from 'react';
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUpdateInstruction } from "@/api/Instruction.api.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Pencil } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import { GetInstruction } from '@/types/instruction';

type Props = {
    id: number;
    oldQuantity: number;
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     instructions: GetInstruction[],     status: number }, unknown>>

};

const formSchema = z.object({
    quantity: z.number().min(0.01, "Quantity must be greater than 0"),
});

const UpdateInstructionQuantity = ({ id, oldQuantity, refetch }: Props) => {
    const { update, response, isSuccess } = useUpdateInstruction();
    const [open, setOpen] = React.useState(false);
    // Use form hook and pass it to FormProvider

    useEffect(() => {
        if(isSuccess && response  && response?.status === 201) {
            refetch()
            setOpen(false)
        }
    }, [isSuccess]);
    const form = useForm<{ quantity: number }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            quantity: oldQuantity,
        },
    });

    const onSubmit = (data: {quantity:number}) => {
        if(data.quantity === oldQuantity ){
            form.setError("quantity", {
                type: "manual",
                message:"You haven't changed anything ",
            });

        }else{
            update({...data, id:id})
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className={'flex items-center justify-center p-3 rounded-2xl'}>
                <Pencil className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Quantity</DialogTitle>
                    <DialogDescription>
                        Make sure the quantity is correct before updating.
                    </DialogDescription>
                </DialogHeader>
                {/* Wrap the form in the FormProvider */}
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className={'flex'}>
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Update Quantity
                        </Button>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateInstructionQuantity;
