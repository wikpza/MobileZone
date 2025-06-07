import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Eye} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {GetPermissionsList} from "@/types/permisions.ts";

type Props = {
    permissions:GetPermissionsList[] | undefined
}

const AvailablePermissions = ({permissions}:Props) => {
    const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
    if(!permissions) return (<div>Unable to load data</div>)
    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mb-6 ">
            <div className="bg-white shadow-box rounded-lg p-6 lg:col-span-3 shadow-box">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Available Permissions</h2>

                    <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Eye className="mr-2 h-4 w-4"/>
                                View All Permissions
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>All Available Permissions</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Permission Name</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.map((permission) => (
                                            <TableRow key={permission.id}>
                                                <TableCell className="font-medium">{permission.permission}</TableCell>
                                                <TableCell>{permission.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AvailablePermissions;