
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"

import {
    User,
    Mail,
    Phone,
    Calendar,
    Building,
    Lock,
    Eye,
    EyeOff, Shield
} from "lucide-react"
import {useGetPersonalData} from "@/api/Employee.api.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import React from "react";
import UpdateEmployeeDataDialog from "@/pages/admin/EmployeePage/UpdateEmployeeDataDialog.tsx";

export default function AdminProfilePage() {
    const {data, isLoading} = useGetPersonalData()

    if(isLoading) return (<div>.... Loading</div>)

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!data || !data.employees) return (<div>unable to load data</div>)


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">View and update your personal information</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Update your personal details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={`${data.employees.firstName} ${data.employees.middleName} ${data.employees.lastName}`}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.employees.address}
                                    // onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    value={data.employees.phone}
                                    // onChange={(e) => setPhone(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        {/*<Button onClick={handleUpdateProfile}>*/}
                        {/*    Save Changes*/}
                        {/*</Button>*/}
                    </CardFooter>
                </Card>

                {/* Account Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            View your account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label>Position</Label>
                            <p className="text-sm font-medium">{data.employees.position.name}</p>
                        </div>

                        <div className="space-y-1">
                            <Label>Salary</Label>
                            <p className="text-sm font-medium">${data.employees.salary}</p>
                        </div>

                        <div className="space-y-1">
                            <Label>Join Date</Label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm font-medium">{data.employees.createdAt.toString()}</p>
                            </div>
                        </div>

                        {/*<div className="space-y-1">*/}
                        {/*    <Label>Last Login</Label>*/}
                        {/*    <p className="text-sm font-medium">{adminData.lastLogin}</p>*/}
                        {/*</div>*/}
                        <UpdateEmployeeDataDialog updateText={'Update Login/Password'}/>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}