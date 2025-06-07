import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import { PlusCircle} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from 'zod'
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {GetLoanType, TakeLoanType} from "@/types/loan.ts";
import {useTakeLoan} from "@/api/loan.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";


const loanFormSchema = z.object({
    loanSum: z.coerce.number().positive({ message: "Amount must be positive" }),
    procentStavka: z.coerce.number().positive({ message: "Interest rate must be positive" }),
    periodYear: z.coerce.number().int().positive({ message: "Term must be a positive integer" }),
    penyaStavka: z.coerce.number().positive({ message: "Penalty rate must be positive" }),
});


type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     loans: GetLoanType[],     status: number }, unknown>>

}
const CreateLoanDialog = ({refetch}:Props) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {create, isSuccess, response} = useTakeLoan()
    const isMobile = useIsMobile();
    const form = useForm<TakeLoanType>({
        resolver: zodResolver(loanFormSchema),
        defaultValues: {
            loanSum: 0,
            procentStavka: 0,
            periodYear: 0,
            penyaStavka: 0
        },
    });

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >=400 && response?.status < 500) {
            if ("loanSum" in response.response.details) {
                form.setError("loanSum", {
                    type: "manual",
                    message: response.response.details.loanSum.join(","),
                });
            }else if ("procentStavka" in response.response.details) {
                form.setError("procentStavka", {
                    type: "manual",
                    message: response.response.details.procentStavka.join(","),
                });
            }else if ("penyaStavka" in response.response.details) {
                form.setError("penyaStavka", {
                    type: "manual",
                    message: response.response.details.penyaStavka.join(","),
                });
            }else {
                toast.error(response.response.message);
            }

        }
    }, [response, form]);

    useEffect(() => {
        if(isSuccess && response  && response?.status === 201) {
            refetch()
            setIsDialogOpen(false)
            form.reset()
        }
    }, [isSuccess]);

    function onSubmit(values: TakeLoanType) {
       create(values)
    }
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Loan
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("sm:max-w-[550px]", isMobile && "w-[90%] max-h-[90%] overflow-y-auto")}>
                <DialogHeader>
                    <DialogTitle>Create New Loan</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to create a new loan entry.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                        <FormField
                            control={form.control}
                            name="loanSum"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Amount (KreditSumma)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter loan amount"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The total amount of the loan.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="procentStavka"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Interest Rate (ProcentStavka) %</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter interest rate"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Annual interest rate in percentage.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="periodYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Loan Term (SrokLet) in Years</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter loan term"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Duration of the loan in years.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="penyaStavka"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Penalty Rate (PenyaStavka) %</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Enter penalty rate"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Penalty rate for late payments in percentage.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Create Loan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateLoanDialog;