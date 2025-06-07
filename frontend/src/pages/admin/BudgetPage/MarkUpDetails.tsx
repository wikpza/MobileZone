import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {GetBudgetType, SetMarkUpType} from "@/types/budget.ts";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useGetEmployee} from "@/api/Employee.api.ts";
import {FormErrors, isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

type Props = {
    markUp:number,
    updateItem:(input: { markUp: number, }) => void
    isSuccess:boolean
    response: {     budget?: GetBudgetType
        response?: FormErrors | {         message: string     }
        status: number }

}

const formSchema = z.object({
    markUp: z.number()
        .int("markUp must be an integer") // Проверяет, что число целое
        .min(1, "markUp must be greater than 0") // Должно быть больше 0

});

const MarkUpDetails = ({markUp, updateItem, isSuccess, response}:Props) => {
    const [isMarkupDialogOpen, setIsMarkupDialogOpen] = useState(false)

    const form = useForm<SetMarkUpType>({
        resolver:zodResolver(formSchema),

    })

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            toast.error(response.response.message);
        }
    }, [response, form]);

    useEffect(() => {
        if (isSuccess && response && response?.status >= 200 && response?.status < 300) {
            form.reset()
            setIsMarkupDialogOpen(false)
        }
    }, [isSuccess]);



    const {data, isLoading} = useGetEmployee()
    if(isLoading) return (<div>...Loading</div>)
    if(!data) return(<div>unable to get data</div>)
    const handleUpdateMarkup = (input:SetMarkUpType) => {
       updateItem(input)
    }

    return (
        <div>
            <CardHeader>
                <CardTitle className={'font-semibold'}>Current Markup</CardTitle>
                <CardDescription>Product pricing markup</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <p className="text-3xl font-semibold">{markUp}%</p>
                    <Dialog open={isMarkupDialogOpen} onOpenChange={setIsMarkupDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Update Markup</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Markup Percentage</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">

                                <Form {...form}>
                                    <form className={'space-y-4'}
                                          onSubmit={form.handleSubmit(handleUpdateMarkup)}>


                                        <div className="space-y-2">
                                            <FormField
                                                control={form.control}
                                                name="markUp"
                                                render={({field}) => {

                                                    return (
                                                        <FormItem>
                                                            <FormLabel>Mark up</FormLabel>
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
                                        </div>
                                        <Button  className="w-full">
                                            Update Markup
                                        </Button>
                                    </form>
                                </Form>


                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </div>
    );
};

export default MarkUpDetails;