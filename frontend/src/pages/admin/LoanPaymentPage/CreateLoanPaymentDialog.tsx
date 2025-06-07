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
import {Calendar as CalendarIcon, CreditCard} from "lucide-react";
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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {GetLoanPaymentType, GetLoanType, PayLoanType} from "@/types/loan.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {useIsMobile} from "@/hooks/use-mobile.tsx";
import {useGetCountLoanPayment, usePayLoan} from "@/api/loan.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {useGetEmployee} from "@/api/Employee.api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

const repaymentFormSchema = z.object({
    loanId: z.number().min(1, "Please select a loan"),
    giveDate: z.date({ required_error: "Repayment date is required" }),
});


type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     payment: GetLoanPaymentType[],     status: number }, unknown>>
    loanList: GetLoanType[]
}
const CreateLoanPaymentDialog = ({refetch, loanList}:Props) => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const {create, isSuccess, response} = usePayLoan()
    const {data:employeeList, isLoading:isGetEmployeesLoading} = useGetEmployee()


    const isMobile = useIsMobile();
    const form = useForm<PayLoanType>({
        resolver: zodResolver(repaymentFormSchema),
        defaultValues: {
        }
    });
    const { data, refetch: countRefetch } = useGetCountLoanPayment({
        loanId: form.getValues('loanId')?.toString() ?? "0",  // keep as string
        giveDate: new Date(form.getValues('giveDate') ?? Date.now())  // convert to Date object
    });

    useEffect(() => {
    }, [data]);

    useEffect(() => {
        countRefetch()
    }, [form.watch('loanId'), form.watch('giveDate')]);


    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >=400 && response?.status < 500) {
            if ("loanId" in response.response.details) {
                form.setError("loanId", {
                    type: "manual",
                    message: response.response.details.loanId.join(","),
                });
            }else if ("employeeId" in response.response.details) {
                form.setError("employeeId", {
                    type: "manual",
                    message: response.response.details.employeeId.join(","),
                });
            }else if ("giveDate" in response.response.details) {
                form.setError("giveDate", {
                    type: "manual",
                    message: response.response.details.giveDate.join(","),
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

    function onSubmit(values: PayLoanType) {
        create(values)
        }

        console.log(form.getValues('giveDate'))

    // if() return ()

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Record Repayment
                </Button>
            </DialogTrigger>
            <DialogContent className={cn("sm:max-w-[550px]", isMobile && "w-[90%] max-h-[90%] overflow-y-auto")}>
                {data?.status && (data.status === 401 || data.status === 403) ?
                    <AccessDeniedPage/>
                    :
                    <div>
                        <DialogHeader>
                            <DialogTitle>Record Loan Repayment</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to record a loan repayment.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                <FormField
                                    control={form.control}
                                    name="loanId"
                                    render={({field}) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>Employee</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}  // Convert string to number
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Loan"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {loanList.map((loan) => (
                                                            <SelectItem key={loan.id} value={loan.id.toString()}>
                                                                Loan #{loan.id} - ${loan.loanSum.toLocaleString()}
                                                            </SelectItem>
                                                        ))}

                                                        {loanList.length === 0 &&
                                                            <div className={'p-3 cursor-pointer'}>Before paying for
                                                                loan, take a loan </div>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )
                                    }}
                                />


                                <FormField
                                    control={form.control}
                                    name="giveDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Repayment Date (DataVyplaty)</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        // disabled={(date) =>
                                                        //     date > new Date() || date < new Date("1900-01-01")
                                                        // }
                                                        initialFocus
                                                        className={cn("p-3 pointer-events-auto")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>
                                                Date when the repayment was made.
                                            </FormDescription>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />


                                {data && form.getValues('loanId') && (
                                    <div className="flex flex-col p-3 border rounded-md bg-muted/20">
                                        <div className="text-sm font-medium">Summary</div>

                                        <div className="flex justify-between mt-2">
                                            <span className="text-sm text-muted-foreground">Principal payment:</span>
                                            <span
                                                className="text-sm font-medium">${data?.result?.loanPart && data?.result?.loanPart.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString() || '0'}</span>
                                        </div>

                                        <div className="flex justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">Payment date:</span>
                                            <span
                                                className="text-sm font-medium">{(data?.result && data?.result?.LastPaymentDate) ? format(data?.result?.LastPaymentDate, "PPP") : '0'}</span>
                                        </div>

                                        <div className="flex justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">Interest Amount:</span>
                                            <span
                                                className="text-sm font-medium">${data?.result?.loanProcent ? data?.result?.loanProcent.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString() : '0'}</span>
                                        </div>

                                        <div className="flex justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">Penalty:</span>
                                            <span
                                                className="text-sm font-medium">${data?.result?.penya ? data?.result?.penya.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString() : '0'}</span>
                                        </div>

                                        <div className="flex justify-between mt-1">
                                            <span className="text-sm text-muted-foreground">Overdue Days:</span>
                                            <span
                                                className="text-sm font-medium">{data?.result?.overdueDays ? data?.result?.overdueDays.toFixed(3).replace(/(\.0{1,3})$/, '').toLocaleString() : '0'}</span>
                                        </div>

                                    </div>)}

                                <DialogFooter>
                                    <Button type="submit">Record Repayment</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>

                }
            </DialogContent>
        </Dialog>
    );
};

export default CreateLoanPaymentDialog;