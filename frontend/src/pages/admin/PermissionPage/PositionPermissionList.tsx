import React, {useEffect, useState} from 'react';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {MinusCircle, PlusCircle} from "lucide-react";
import {useGetPositionPermissions, useUpdatePositionPermission} from "@/api/permissions.api.ts";
import {GetPosition} from "@/types/position.ts";
import {GetPermissionsList} from "@/types/permisions.ts";

type Props = {
    position:GetPosition,
    permissions:GetPermissionsList[]
}
const EmployeePermissionList = ({position, permissions:permissionList}:Props) => {
    const { data: permissions, isLoading: isGetPermissionsLoading, refetch } = useGetPositionPermissions(position.id);
    const { update, isSuccess, response } = useUpdatePositionPermission();

    const [permissionAddList, setPermissionAddList] = useState<GetPermissionsList[]>([]);

    // Отслеживаем успех обновления прав
    useEffect(() => {
        if (isSuccess && response?.status >= 200 && response?.status < 300) {
            refetch();
        }

    }, [isSuccess]);

    // Отслеживаем обновление списка разрешений
    useEffect(() => {
        if (permissions) {
            const updatedPermissionAddList = permissionList.filter(permission => {
                const isExisting = permissions.some(existingPermission => existingPermission.permissionId === permission.id);
                console.log(`Permission with id ${permission.id} is already in permissions: ${isExisting}`);
                return !isExisting;
            });
            setPermissionAddList(updatedPermissionAddList); // Обновляем состояние
        }
    }, [permissions, permissionList]);

    // Перезагрузка данных при изменении позиции
    useEffect(() => {
        refetch();
    }, [position]);

    // Состояние загрузки
    if (isGetPermissionsLoading) return <div>....Loading</div>;
    if (!permissions) return <div>unable to load</div>;



    return (
        <div className="space-y-6 ">
            <div>
                <h3 className="text-md font-medium mb-2">Current Permissions for {position.name}</h3>
                {permissions && permissions.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Permission</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-24 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.map((positionPermission) => (
                                    <TableRow key={positionPermission.id}>
                                        <TableCell className="font-medium">{positionPermission.permission.permission}</TableCell>
                                        <TableCell>{positionPermission.permission.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => update({permissionId:positionPermission.permissionId, positionId:position.id, type:"delete"})}
                                            >
                                                <MinusCircle className="h-4 w-4 text-red-500"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No permissions assigned to this position.</p>
                )}
            </div>

            <div>
                <h3 className="text-md font-medium mb-2">Available Permissions to Add</h3>
                {permissionAddList.length > 0 ? (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Permission</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="w-24 text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissionAddList.map((permission) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="font-medium">{permission.permission}</TableCell>
                                        <TableCell>{permission.description}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => update({permissionId:permission.id, positionId:position.id, type:"add"})}
                                            >
                                                <PlusCircle className="h-4 w-4 text-green-500"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">All permissions have been assigned to this position.</p>
                )}
            </div>
        </div>
    );
};

export default EmployeePermissionList;