import React, {useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import IngredientsForm from "@/pages/admin/InstructionsPage/IngredientsForm.tsx";
import {GetProductType} from "@/types/product.ts";
import MakeReportManufacturing from "@/pages/admin/ReportPage/MakeReportManufacturing.tsx";
import MakeReportProcurement from "@/pages/admin/ReportPage/MakeReportProcurement.tsx";
import MakeReportSalary from "@/pages/admin/ReportPage/MakeReportSalary.tsx";
import MakeReportPurchase from "@/pages/admin/ReportPage/MakeReportPurchase.tsx";
import MakeReportEmployee from "@/pages/admin/ReportPage/MakeReportEmployee.tsx";
import {useGetDirector, useGetEmployee, useGetPersonalData} from "@/api/Employee.api.ts";
import {GetEmployeeType} from "@/types/employee.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import MakeReportLoanPayment from "@/pages/admin/ReportPage/MakeReportLoanPayment.tsx";

const ReportPage = () => {
    const {data:employeeData, isLoading:isEmployeeLoading} = useGetPersonalData()
    const {data, isLoading}  = useGetDirector()
    const reportList = [
        {
            name:"Manufacturing"
        },
        {
            name:"Salary"
        },
        {
            name:"Purchase"
        },
        {
            name:"Procurement"
        },
        {
            name:"Employee"
        },
        {
            name:"Loan Payment"
        }
    ]
    const [selectedReportType, setSelectedReportType] = useState<{name:string}>({name:""});

    if(!data || !employeeData) return (<div>Unable to load data</div>)


    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if(!employeeData) return (<div>unable to load data</div>)
    if(!data) return (<div>Select Director, before creating report</div>)

    console.log("employee", employeeData)
    console.log("director", data)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Report</h1>
            </div>

            <div className="w-full max-w-xs">
                <Select
                    value={selectedReportType.name}
                    onValueChange={(value) => {
                        setSelectedReportType({name: value});
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a type of Report"/>
                    </SelectTrigger>
                    <SelectContent>
                        {reportList.map((value, index) => (
                            <SelectItem key={index} value={value.name}>
                                {value.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>



            {selectedReportType.name === 'Manufacturing' && (
                <MakeReportManufacturing
                    employee={employeeData.employees}
                    signature={{
                    name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                    position: data?.employees.position.name
                }}/>
            )}

            {selectedReportType.name === 'Salary' &&   (
                <MakeReportSalary
                    employee={employeeData.employees}
                    signature={{
                        name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                    position: data?.employees.position.name
                }}/>
            )}

            {selectedReportType.name === 'Purchase' &&  (
                <MakeReportPurchase
                    employee={employeeData.employees}
                    signature={{
                        name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                    position: data?.employees.position.name
                }}/>
            )}

            {selectedReportType.name === 'Procurement' &&  (
                <MakeReportProcurement
                    employee={employeeData.employees}
                    signature={{
                        name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                    position: data?.employees.position.name
                }}/>
            )}

            {selectedReportType.name === 'Employee' &&  (
                <MakeReportEmployee
                    employee={employeeData.employees}
                    signature={{
                        name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                    position: data?.employees.position.name
                }}/>
            )}

            {selectedReportType.name === 'Loan Payment' &&  (
                <MakeReportLoanPayment
                    employee={employeeData.employees}
                    signature={{
                        name: data.employees.id === employeeData?.employees.id ? "" :  `${data?.employees.firstName[0]}.${data.employees.middleName[0]}.${data.employees.lastName}`,
                        position: data?.employees.position.name
                    }}/>
            )}


        </div>
    );
};

export default ReportPage;