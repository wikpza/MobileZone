import React, {useEffect} from 'react';
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
import {useCreatePosition, useGetPositions} from "@/api/position.api.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useCreateEmployee} from "@/api/Employee.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {CreatePositionType, GetPosition} from "@/types/position.ts";


const formSchema = z.object({
    name: z.string().min(1, 'First name is required'),

})

type Props = {
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{
        positions: GetPosition[]
        status: number }, unknown>>
}
const PositionCreateForm = ({refetch}:Props) => {
    const {create, isSuccess, response} = useCreatePosition()
    const [open, setOpen] = React.useState(false);
    const methods = useForm<CreatePositionType>({
        resolver: zodResolver(formSchema),
    });
    const {data, isLoading} = useGetPositions()

    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("name" in response.response.details) {
                methods.setError("name", {
                    type: "manual",
                    message: response.response.details.name.join(","),
                });
            } else {
                toast.error(response.response.message);
            }
        }
    }, [response, methods]);

    useEffect(() => {
        if (isSuccess && response && response?.status === 201) {
            refetch();
            setOpen(false);
        }
    }, [isSuccess]);

    if(isLoading) return (<div>...Loading</div>)
    if(!data) return (<div>unable to load position</div>)



    const onSubmit = (values: CreatePositionType) => {
        create(values)
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger>
                <Button >
                    <Plus className="mr-2 h-4 w-4" /> Add Position
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Position</DialogTitle>
                    <DialogDescription>
                        The dialog helps you to add position.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(onSubmit)}
                        >

                            <div className={'space-y-5 py-5'}>

                                <FormField
                                    control={methods.control}
                                    name="name"
                                    render={({ field }) =>{
                                        return(
                                            <FormItem>
                                                <FormLabel>Name of position</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value)
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

export default PositionCreateForm;

