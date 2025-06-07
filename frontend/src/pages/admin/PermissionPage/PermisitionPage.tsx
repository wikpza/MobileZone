

import React, { useState, useEffect } from "react";
import {useGetPermissions, useGetPositionPermissions} from "@/api/permissions.api.ts";
import AvailablePermissions from "@/pages/admin/PermissionPage/AvailablePermissions.tsx";
import SelectPosition from "@/pages/admin/PermissionPage/SelectPosition.tsx";
import {useGetPositions} from "@/api/position.api.ts";
import {GetPosition} from "@/types/position.ts";
import PositionPermissionList from "@/pages/admin/PermissionPage/PositionPermissionList.tsx";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";



export type Permission = {
    id: string
    name: string
    description: string
}

export type Position = {
    id: string
    title: string
    department: string
    description?: string
    createdAt: Date
    updatedAt: Date
    permissions?: Permission[]
}


// Sample data
const samplePermissions: Permission[] = [
    {
        id: "1",
        name: "ProductSale",
        description: "Permission to sell a product"
    },
    {
        id: "2",
        name: "BudgetManagement",
        description: "Permission to manage company budget"
    },
    {
        id: "3",
        name: "EmployeeManagement",
        description: "Permission to manage employees"
    },
    {
        id: "4",
        name: "MaterialProcurement",
        description: "Permission to procure raw materials"
    },
    {
        id: "5",
        name: "Manufacturing",
        description: "Permission to schedule manufacturing"
    },
    {
        id: "6",
        name: "ReportViewing",
        description: "Permission to view company reports"
    },
];

const samplePositions: Position[] = [
    {
        id: "1",
        title: "Production Manager",
        department: "Production",
        description: "Oversees all production activities",
        createdAt: new Date("2023-01-15"),
        updatedAt: new Date("2023-04-20"),
        permissions: [samplePermissions[4], samplePermissions[3]]
    },
    {
        id: "2",
        title: "Sales Representative",
        department: "Sales",
        description: "Manages product sales",
        createdAt: new Date("2023-02-10"),
        updatedAt: new Date("2023-05-05"),
        permissions: [samplePermissions[0]]
    },
    {
        id: "3",
        title: "Financial Manager",
        department: "Finance",
        description: "Manages company finances",
        createdAt: new Date("2023-03-20"),
        updatedAt: new Date("2023-06-10"),
        permissions: [samplePermissions[1], samplePermissions[5]]
    },
    {
        id: "4",
        title: "HR Manager",
        department: "Human Resources",
        description: "Manages personnel",
        createdAt: new Date("2023-01-20"),
        updatedAt: new Date("2023-04-15"),
        permissions: [samplePermissions[2]]
    }
];

const PermissionsManagementPage = () => {
    const {data:permissionList, isLoading:isGetPermissionLoading} = useGetPermissions()
    const {data:positionList, isLoading:isGetPositionLoading} = useGetPositions()

    const [selectedPosition, setSelectedPosition] = useState<GetPosition>();

    if(isGetPermissionLoading) return (<div>....Loading</div>)

    if(permissionList?.status && (permissionList.status === 401 || permissionList.status === 403 ) ) return (<AccessDeniedPage/>)
    if(positionList?.status && (positionList.status === 401 || positionList.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!permissionList?.permission || !positionList?.positions) return (<div>unable to load data</div>)

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Permissions Management</h1>

            <AvailablePermissions permissions={permissionList.permission}/>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 ">

                <div className="bg-white shadow-box rounded-lg p-6 lg:col-span-3">
                    <h2 className="text-lg font-semibold mb-4">Role Permissions</h2>

                    <SelectPosition positions={positionList.positions} setSelectedProduct={setSelectedPosition} selectedPosition={selectedPosition}/>

                    {selectedPosition && (
                        <PositionPermissionList position={selectedPosition} permissions={permissionList.permission}/>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermissionsManagementPage;