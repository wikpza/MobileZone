import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Pencil, Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {CreateEmployeeType, GetEmployeeType, UpdateEmployeeType} from "@/types/employee.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {PacmanLoader} from "react-spinners";
import EmployeeInput from "@/components/ui/EmployeeInput.tsx";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useGetPositions} from "@/api/position.api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useCreateEmployee, useUpdateEmployee} from "@/api/Employee.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";


const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Second name is required'),
    middleName: z.string().min(1, 'Second name is required'),

    salary:z.number().min(1, "Salary is required"),
    address: z.string().min(1, 'Second name is required'),
    positionId: z.number().min(1, "Please select a position"),

    phone: z.string().length(17,{message:"length must be 18"}).regex(/^\+\d{3}\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: "Phone number must be in the format +996(NNN)-NN-NN-NN"
    })
})

type Props = {
    refetch: ()=>void
    employee:GetEmployeeType
}
const EmployeeCreateForm = ({refetch, employee}:Props) => {
    const {update, isSuccess, response} = useUpdateEmployee()
    const [open, setOpen] = React.useState(false);
    const methods = useForm<UpdateEmployeeType>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            firstName:employee.firstName,
            lastName:employee.lastName,
            middleName:employee.middleName,
            phone:employee.phone,
            address:employee.address,
            positionId:employee.positionId,
            salary:employee.salary
        }
    });
    const {data, isLoading} = useGetPositions()

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("positionId" in response.response.details) {
                methods.setError("positionId", {
                    type: "manual",
                    message: response.response.details.positionId.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response, methods]);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        if (isSuccess && response && response?.status === 201) {
            refetch();
            setOpen(false);
        }
    }, [isSuccess]);

    if(isLoading) return (<div>...Loading</div>)
    if(!data || !data?.positions) return (<div>unable to load position</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<div/>)


    const onSubmit = (values: UpdateEmployeeType) => {
        update({id:employee.id, ...values})
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <Pencil className="h-4 w-4"/>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                    <DialogDescription>
                        The dialog helps you to add employee to you company.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >
                            <PacmanLoader color={"#ffde21"} loading={false}>
                                <div>hello</div>
                            </PacmanLoader>
                            <div className={'space-y-5 py-5'}>
                                <EmployeeInput name={'firstName'} label={'First Name'} form={methods}/>
                                <EmployeeInput name={'lastName'} label={'Last name'} form={methods}/>
                                <EmployeeInput name={'middleName'} label={'Middle name'} form={methods}/>

                                <PhoneNumberInput form={methods}/>

                                <EmployeeInput name={'address'} label={'Address'} form={methods}/>

                                <FormField
                                    control={methods.control}
                                    name="positionId"
                                    render={({ field }) => {
                                        return(
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}  // Convert string to number
                                                    value={field.value?.toString() || ''}  // Ensure value is a string for Select
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {data.positions.map((employee) => (
                                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                                {employee.name}
                                                            </SelectItem>
                                                        ))}

                                                        {data.positions.length === 0 && <div className={'p-3 cursor-pointer'}>Before adding employee, add a position </div>}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}}
                                />

                                <FormField
                                    control={methods.control}
                                    name="salary"
                                    render={({ field }) =>{

                                        return(
                                            <FormItem>
                                                <FormLabel>Salary</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(parseFloat(e.target.value))
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}}
                                />

                            </div>


                            <Button className={'ml-auto'}>Confirm</Button>

                        </form>
                    </Form>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default EmployeeCreateForm;

