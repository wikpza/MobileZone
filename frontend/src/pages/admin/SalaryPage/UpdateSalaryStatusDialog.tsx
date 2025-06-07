// import React, {useEffect, useState} from 'react';
// import {
//     Dialog, DialogClose,
//     DialogContent,
//     DialogDescription, DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger
// } from "@/components/ui/dialog.tsx";
// import {Button} from "@/components/ui/button.tsx";
// import * as z from "zod";
// import {useForm} from "react-hook-form";
// import {SaleProductType} from "@/types/product.ts";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {ChangeTotalSalary, GetSalaryList} from "@/types/salary.ts";
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
// import {Check, Edit} from "lucide-react";
// import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
// import {useUpdateSalary, useUpdateSalaryStatus} from "@/api/salary.api.ts";
// import {FormErrors, isFormErrors} from "@/lib/errors";
// import {toast} from "sonner";
// import {useGetEmployee} from "@/api/Employee.api.ts";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
//
// const formSchema = z.object({
//     employeeId: z.number().min(1, "Please select a position"),
//
// })
//
// type Props = {
//     salary:GetSalaryList
//     refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     data?: GetSalaryList[]
//         response?: FormErrors | {         message: string     }
//         status: number }, unknown>>
// }
//
// const UpdateSalaryStatusDialog = ({salary, refetch}:Props) => {
//     const {update, isSuccess, response} = useUpdateSalaryStatus()
//
//     useEffect(() => {
//
//     }, [salary]);
//
//     console.log(salary)
//
//     const {data:employeeList, isLoading:isGetEmployeesLoading} = useGetEmployee()
//
//     useEffect(() => {
//         if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
//             if ("employeeId" in response.response.details) {
//                 form.setError("employeeId", {
//                     type: "manual",
//                     message: response.response.details.employeeId.join(","),
//                 });
//             }else {
//                 toast.error(response.response.message);
//             }
//         }
//     }, [response]);
//
//     useEffect(() => {
//         if (isSuccess && response?.status >= 200 && response?.status < 300) {
//             refetch()
//             setIsDialogOpen(false)
//
//         }
//     }, [isSuccess]);
//
//     const form = useForm<{employeeId:number}>({
//         resolver:zodResolver(formSchema),
//     })
//     const handleSubmit = (values: {employeeId:number}) => {
//         update({employeeId:values.employeeId, id:salary.id})
//     };
//
//     const [isDialogOpen, setIsDialogOpen] = useState(false)
//     return (
//         <Dialog open={false} >
//             <DialogTrigger disabled={salary.isGiven}>
//                 <Button
//                     size="sm"
//                     variant={salary.isGiven ? "default" : "outline"}
//                     className="h-8 px-2 flex gap-1"
//                     disabled={salary.isGiven}
//                 >
//                     <Check className="h-4 w-4"/>
//                     Paid
//                 </Button>
//
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//                 <Form {...form}>
//                     <form
//                         onSubmit={form.handleSubmit(handleSubmit)}>
//                         <DialogHeader>
//                             <DialogTitle>Edit Salary Amount</DialogTitle>
//                             <DialogDescription>
//                                 <div>Update salary status for {`${salary.employee.firstName[0]}.${salary.employee.middleName[0]}.${salary.employee.lastName}`}</div>
//                                 <div className={'text-red-700 mt-5'}>Warning: After you change the status to "issued," the salary amount cannot be modified.</div>
//                             </DialogDescription>
//                         </DialogHeader>
//
//
//                         <div className="space-y-4 py-2">
//
//
//
//                             <FormField
//                                 control={form.control}
//                                 name="employeeId"
//                                 render={({ field }) => {
//                                     return(
//                                         <FormItem>
//                                             <FormLabel>Employee</FormLabel>
//                                             <Select
//                                                 onValueChange={(value) => field.onChange(Number(value))}  // Convert string to number
//                                                 value={field.value?.toString() || ''}  // Ensure value is a string for Select
//                                             >
//                                                 <FormControl>
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select a Employee" />
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {employeeList.map((employee) => (
//                                                         <SelectItem key={employee.id} value={employee.id.toString()}>
//                                                             {`ID: ${employee.id} FIO: ${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName} - ${employee.position.name}`}
//                                                         </SelectItem>
//                                                     ))}
//
//                                                     {employeeList.length === 0 && <div className={'p-3 cursor-pointer'}>Before incoming budget, add a employee </div>}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}}
//                             />
//
//                         </div>
//
//                         <DialogFooter className=" mt-5 sm:justify-between">
//                             <DialogClose asChild>
//                                 <Button type="button" variant="outline">
//                                     Cancel
//                                 </Button>
//                             </DialogClose>
//                             <Button type="submit"
//
//                             >
//                                 Save Changes
//                             </Button>
//                         </DialogFooter>
//                     </form>
//                 </Form>
//
//             </DialogContent>
//         </Dialog>
//     );
// };
//
// export default UpdateSalaryStatusDialog;