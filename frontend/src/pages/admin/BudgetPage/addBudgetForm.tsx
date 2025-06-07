import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {GetBudgetType, IncomeBudget} from "@/types/budget.ts";
import {useGetEmployee} from "@/api/Employee.api.ts";
import {FormErrors, isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";

type Props = {
    addBudget: (input: IncomeBudget) => void
    isSuccess:boolean
    response: {     budget?: GetBudgetType,     response?: FormErrors | {         message: string     } ,    status: number }
}

const formSchema = z.object({
    amount: z.number().min(1, "amount is required"),
});

const AddBudgetForm = ({ addBudget, response, isSuccess }: Props) => {
    const methods = useForm<IncomeBudget>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (isSuccess && response && response?.status >= 200 && response?.status < 300) {
            methods.reset()
        }
    }, [isSuccess]);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("amount" in response.response.details) {
                methods.setError("amount", {
                    type: "manual",
                    message: response.response.details.employeeId.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }



    }, [response, methods]);


    const onSubmit = (input:IncomeBudget) => {
        addBudget(input)
    }

    return (
        <Card className={'shadow-box'}>
            <CardHeader>
                <CardTitle>Add Dollars</CardTitle>
                <CardDescription>Increase your budget</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">

                        <Form {...methods}>
                            <form className={'space-y-5'}
                                  onSubmit={methods.handleSubmit(onSubmit)}>


                                <FormField
                                    control={methods.control}
                                    name="amount"
                                    render={({ field }) =>{

                                        return(
                                            <FormItem>
                                                <FormLabel>Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseFloat(e.target.value))
                                                        }
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}}
                                />
                                <Button className="w-full" >
                                    Add Dollars
                                </Button>
                            </form>
                        </Form>
                    </div>


                </div>
            </CardContent>
        </Card>
    );
};

export default AddBudgetForm;
