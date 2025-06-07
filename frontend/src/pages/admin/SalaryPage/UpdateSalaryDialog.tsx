import React, {useEffect, useState} from 'react';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { GetSalaryList} from "@/types/salary.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Edit} from "lucide-react";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {useUpdateSalary} from "@/api/salary.api.ts";
import {FormErrors, isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

const formSchema = z.object({
    salary:z.number().min(0.01, "Quantity must be a greater than 0")

})

type Props = {
    salary:GetSalaryList
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     data?: GetSalaryList[]
        response?: FormErrors | {         message: string     }
        status: number }, unknown>>
}

const UpdateSalaryDialog = ({salary, refetch}:Props) => {
    const {update, isSuccess, response} = useUpdateSalary()

    useEffect(() => {

    }, [salary]);

    // console.log(salary)
    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("salary" in response.response.details) {
                form.setError("salary", {
                    type: "manual",
                    message: response.response.details.salary.join(","),
                });
            }else {
                toast.error(response.response.message);
            }
        }
    }, [response]);

    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch()
            setIsDialogOpen(false)

        }
    }, [isSuccess]);

    const form = useForm<{salary:number}>({
        resolver:zodResolver(formSchema),
        defaultValues:{ salary:salary.totalSalary}
    })
    const handleSubmit = (values: {salary:number}) => {
        console.log(salary)
        update({salary:values.salary, id:salary.id})
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                >
                    <Edit className="h-4 w-4"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Edit Salary Amount</DialogTitle>
                            <DialogDescription>
                                Update the total salary for {`${salary.employee.firstName[0]}.${salary.employee.middleName[0]}.${salary.employee.lastName}`}
                            </DialogDescription>
                        </DialogHeader>


                        <div className="space-y-4 py-2">
                            <div className="space-y-2">
                                <label htmlFor="base-salary" className="text-sm font-medium">Base Salary</label>
                                <Input
                                    id="base-salary"
                                    value={salary?.salary}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="bonus" className="text-sm font-medium">Bonus Amount</label>
                                <Input
                                    id="bonus"
                                    value={salary?.bonus}
                                    disabled
                                    className="bg-muted"
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="salary"
                                render={({field}) => {

                                    return (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    value = {form.getValues('salary')}
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

                        </div>

                        <DialogFooter className="sm:justify-between">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit"

                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

                </DialogContent>
            </Dialog>
    );
};

export default UpdateSalaryDialog;