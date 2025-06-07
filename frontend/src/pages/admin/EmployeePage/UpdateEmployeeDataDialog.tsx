import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Plus, Shield} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {CreateEmployeeType, GetEmployeeType} from "@/types/employee.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {PacmanLoader} from "react-spinners";
import {Input} from "@/components/ui/input.tsx";
import {useGetPositions} from "@/api/position.api.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import {toast} from "sonner";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import {useContext, useEffect, useState} from "react";
import {useUpdateEmployeeData} from "@/api/Employee.api.ts";
import {Context} from "@/main.tsx";


const formSchema = z.object({
    login: z.string().min(1, "login is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

type Props = {
    refetch: ()=>void
    id?:number,
    updateText?:string,

}
const UpdateEmployeeData = ({refetch, id, updateText}:Props) => {
    const {update, isSuccess, response} = useUpdateEmployeeData()
    const [open, setOpen] = useState(false);
    const methods = useForm<{login:string, password:string}>({
        resolver: zodResolver(formSchema),
    });
    const {data, isLoading} = useGetPositions()
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {employee} = useContext(Context)

    const togglePasswordVisibility = () => setShowPassword(!showPassword);


    useEffect(() => {
        if (response && response.response && isFormErrors(response.response) && response?.status && response?.status >= 400 && response?.status < 500) {
            if ("login" in response.response.details) {
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
            if(refetch) refetch()
            setOpen(false);
        }
    }, [isSuccess]);

    if(isLoading) return (<div>...Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<div></div>)
    if(!data || !data?.positions) return (<div>unable to load position</div>)


    const onSubmit = (values: CreateEmployeeType) => {
        update({id: id? id:employee.employee.id, ...values})
    };



    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogTrigger>
                {updateText?
                    <Button>
                        <Shield className="mr-2 h-4 w-4" />{updateText}
                    </Button>
                :
                    <Button
                        variant="ghost"
                        size="icon">
                        <Shield className="mr-2 h-4 w-4" />
                    </Button>
                }

            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update personal Employee's data</DialogTitle>
                    <DialogDescription>
                        The dialog helps you to update personal data
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

export default UpdateEmployeeData;

