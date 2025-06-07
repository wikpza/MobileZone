import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BackgroundImage from './../../lib/pictures/background_picture.webp';
import { observer } from "mobx-react-lite";
import { z } from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {FormErrors, isFormErrors} from "../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import { toast } from "sonner";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import {LoginEmployeeType} from "@/types/employee.ts";

type Props = {
    onSave: (LoginEmployeeType: LoginEmployeeType) => void;
    response: { message: string } | FormErrors | undefined;
    status: number | undefined;
};

const formSchema = z.object({
    login: z.string().min(1, "login is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormData = z.infer<typeof formSchema>;

export const LoginForm = observer(({onSave, response, status}:Props) => {

    const form = useForm<LoginFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    useEffect(() => {
        if (response && isFormErrors(response) && status && status >= 400 && status < 500) {
            if ("login" in response.details) {
                form.setError("login", {
                    type: "manual",
                    message:response.details.login.join(","),
                });
            }else if ("password" in response.details) {
                form.setError("password", {
                    type: "manual",
                    message:response.details.password.join(","),
                });
            }else {
                toast.error(response.message);
            }
        }

    }, [response, form]);

    return (
        <FormProvider {...form}>
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    backgroundImage: `url(${BackgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Login to MobileZone</CardTitle>
                        <CardDescription>Enter your credentials to access your account</CardDescription>
                    </CardHeader>

                    {/* Форма */}
                    <form onSubmit={form.handleSubmit((formDataJson: {login:string, password:string})=>onSave(formDataJson))}>
                        <CardContent className="space-y-4">
                            {/* Поле email */}
                            <FormField name="login" control={form.control} render={({ field }) => (
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
                            <FormField name="password" control={form.control} render={({ field }) => (
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
                        </CardContent>

                        {/* Кнопка отправки */}
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full">Login</Button>
                            <p className="text-sm text-center text-muted-foreground">
                                Don't have an account?{" "}
                                {/*<Link to="/register" className="text-primary hover:underline">*/}
                                {/*    Register*/}
                                {/*</Link>*/}
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </FormProvider>
    );
});
