import React, {useEffect} from 'react'
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {CreateUnitType, GetUnit, Unit, UpdateUnitType} from "@/types/unit.ts";
import {useUpdateUnit} from "@/api/Unit.api.ts";

import {Separator} from "@/components/ui/separator.tsx";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Pencil} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{
        unit?: GetUnit[]
        status: number }, unknown>>
    selectedUnit:UpdateUnitType
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
});


const UpdateUnitForm = ({refetch, selectedUnit}:Props) => {
    const [open, setOpen] = React.useState(false);
    const { updateUnit, isLoading, isSuccess, response } = useUpdateUnit()

    const form = useForm<CreateUnitType>({
        resolver: zodResolver(formSchema),
        defaultValues:  {
            name: selectedUnit.name,
        },
    })

    const onSubmit = (input:CreateUnitType)=>{
        if(input.name === selectedUnit.name){
            form.setError("name", {
                type: "manual",
                message:"You haven't changed",
            });
        }else{
            updateUnit({name:input.name, id:selectedUnit.id})

        }
    }

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
            setOpen(false)
        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && isFormErrors(response) && response?.status && response?.status >=400 && response?.status < 500) {

            if ("name" in response.details) {
                console.log(response)
                form.setError("name", {
                    type: "manual",
                    message: response.details.name.join(","),
                });
            }else{
                toast.error(response.message)
            }


        }
    }, [response, form]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Pencil className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit details</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <Separator className={'bg-slate-400 w-full h-[1px] '} />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Kilogram" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button type="submit">Update Unit</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>


    );
};

export default UpdateUnitForm;