import React, {useEffect, useState} from 'react';
import {EmployeeForm} from "@/components/admin/employees/EmployeeForm.tsx";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {CreateEmployeeType, GetEmployeeType} from "@/types/employee.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {PacmanLoader} from "react-spinners";
import EmployeeInput from "@/components/ui/EmployeeInput.tsx";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useGetPositions} from "@/api/position.api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useCreateEmployee} from "@/api/Employee.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import CreateEmployeeInput from "@/components/ui/CreateEmployeeInput.tsx";
import CreatePhoneNumberInput from "@/components/ui/CreatePhoneNumberInput.tsx";


const formSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Second name is required'),
    middleName: z.string().min(1, 'Second name is required'),

    salary:z.number().min(1, "Salary is required"),
    address: z.string().min(1, 'Second name is required'),
    positionId: z.number().min(1, "Please select a position"),

    phone: z.string().length(17,{message:"length must be 18"}).regex(/^\+\d{3}\(\d{3}\)\d{2}-\d{2}-\d{2}$/, {
        message: "Phone number must be in the format +996(NNN)-NN-NN-NN"
    }),
    login: z.string().min(1, "login is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{
        employees: GetEmployeeType[]
        status: number }, unknown>>

}
const EmployeeCreateForm = ({refetch}:Props) => {
    const {create, isSuccess, response} = useCreateEmployee()
    const [open, setOpen] = React.useState(false);
    const methods = useForm<CreateEmployeeType>({
        resolver: zodResolver(formSchema),
    });
    const {data, isLoading} = useGetPositions()
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("positionId" in response.response.details) {
                methods.setError("positionId", {
                    type: "manual",
                    message: response.response.details.positionId.join(","),
                });
            } else if ("login" in response.response.details) {
                methods.setError("login", {
                    type: "manual",
                    message:response.response.details.login.join(","),
                });
            }else if ("password" in response.response.details) {
                methods.setError("password", {
                    type: "manual",
                    message:response.response.details.password.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response, methods, response?.response]);

    useEffect(() => {
        if (isSuccess && response && response?.status === 201) {
            refetch();
            setOpen(false);
        }
    }, [isSuccess]);

    if(isLoading) return (<div>...Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<div></div>)
    if(!data || !data?.positions) return (<div>unable to load position</div>)



    const onSubmit = (values: CreateEmployeeType) => {
        create(values)
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger>
                <Button >
                    <Plus className="mr-2 h-4 w-4" /> Add Employee
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
                                <CreateEmployeeInput name={'firstName'} label={'First Name'} form={methods}/>
                                <CreateEmployeeInput name={'lastName'} label={'Last name'} form={methods}/>
                                <CreateEmployeeInput name={'middleName'} label={'Middle name'} form={methods}/>

                                <CreatePhoneNumberInput form={methods}/>

                                <CreateEmployeeInput name={'address'} label={'Adress'} form={methods}/>

                                <FormField
                                    control={methods.control}
                                    name="positionId"
                                    render={({ field }) => {
                                        return(
                                            <FormItem>
                                                <FormLabel>Position</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}  // Convert string to number
                                                    // value={field.value.toString()}  // Ensure value is a string for Select
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a position" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {data.positions.map((position) => (
                                                            <SelectItem key={position.id} value={position.id.toString()}>
                                                                {position.name}
                                                            </SelectItem>
                                                        ))}

                                                        {data.positions.length === 0 && <div className={'p-3 cursor-pointer'}>Before creating employee, add a position </div>}
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
                                <FormField name="login" control={methods.control} render={({ field }) => (
                                    <FormItem className="flex-1 text-left">
                                        <FormLabel>
                                            <span className=" mr-1">Login</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="login"
                                                type="login"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <div>
                                            <FormMessage className={' mt-1'}/>
                                        </div>
                                    </FormItem>
                                )}/>

                                {/* Поле password */}
                                <FormField name="password" control={methods.control} render={({ field }) => (
                                    <FormItem className="flex-1 text-left relative space-y-0">
                                        <FormLabel>
                                            <span className="mr-1">Password</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute right-2 top-1/3 underline text-sm"
                                                    style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                                                >
                                                    {showPassword ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <div>
                                            <FormMessage className={' mt-2'}  />
                                        </div>

                                    </FormItem>
                                )} />
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

