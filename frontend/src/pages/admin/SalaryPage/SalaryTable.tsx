import React, {useEffect} from 'react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Check, Edit, X} from "lucide-react";
import {GetSalaryList} from "@/types/salary.ts";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query";
import UpdateSalaryDialog from "@/pages/admin/SalaryPage/UpdateSalaryDialog.tsx";
import GiveSalary from "@/pages/admin/SalaryPage/GiveSalary.tsx";
import {FormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";

type Props = {
    employeeSalaries:GetSalaryList[] | undefined
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>)) => Promise<QueryObserverResult<{     data?: GetSalaryList[]
        response?: FormErrors | {         message: string     }
        status: number }, unknown>>
    year:number,
    month:number
}
const SalaryTable = ({employeeSalaries, refetch, year, month}:Props) => {
    useEffect(() => {

    }, [employeeSalaries]);
    if(!employeeSalaries) return <div className={'w-full text-center'}>unable to load salaries</div>

    console.log(employeeSalaries)
    return (
        <div className="rounded-md border overflow-x-auto shadow-box">
            <Table>
                {employeeSalaries.length === 0 && (
                    <TableCaption> You haven't generate any employees salary</TableCaption>
                    // <TableRow>
                    //     <TableCell colSpan={3} className="text-center text-muted-foreground">
                    //         You haven't generate any employees salary
                    //     </TableCell>
                    // </TableRow>
                )}

                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap">Employee Name</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Soled</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Created</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Purchase</TableHead>
                        <TableHead className="text-center whitespace-nowrap">All active</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Bonus ($)</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Salary ($)</TableHead>
                        <TableHead className="text-center whitespace-nowrap">Total Salary ($)</TableHead>
                        {/*<TableHead className="text-center whitespace-nowrap">Date</TableHead>*/}
                        <TableHead className="text-center whitespace-nowrap">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employeeSalaries.map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell>{`${sale.employee.firstName[0]}.${sale.employee.middleName[0]}.${sale.employee.lastName}`}</TableCell>
                            <TableCell className="text-center">{sale.numSoledProduct}</TableCell>
                            <TableCell className="text-center">{sale.numCreatedProduct}</TableCell>
                            <TableCell className="text-center">{sale.numBuyMaterial}</TableCell>
                            <TableCell className="text-center">{sale.numSoledProduct + sale.numCreatedProduct + sale.numBuyMaterial}</TableCell>
                            <TableCell className="text-center">${sale.bonus}</TableCell>
                            <TableCell className="text-center">${sale.salary}</TableCell>
                            {/*<TableCell className="text-center">${sale.totalSalary}</TableCell>*/}

                            <TableCell className="text-center relative">
                                <div className="flex items-center justify-center">
                                    <span className="mr-2">${sale.totalSalary}</span>
                                    {!sale.isGiven && (
                                       <UpdateSalaryDialog salary={sale} refetch={refetch}/>
                                    )}
                                </div>
                            </TableCell>
                            {/*<TableCell  >{ new Date(sale.salaryDate).toLocaleDateString('ru-RU')}</TableCell>*/}
                            <TableCell>
                                <div className="flex items-center justify-center gap-2">
                                    {
                                        sale.isGiven?
                                            <Button
                                                    disabled >
                                                    <Check className="h-4 w-4"/>
                                                    Paid
                                                </Button>

                                            :
                                            <Button
                                                size="sm"
                                                variant={!sale.isGiven ? "default" : "outline"}
                                                className="h-8 px-2 flex gap-1"
                                                // onClick={() => updateSalaryStatus(record.id, "unpaid")}
                                                disabled={sale.isGiven}
                                            >
                                                <X className="h-4 w-4"/>
                                                Unpaid
                                            </Button>

                                    }


                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                    {employeeSalaries.length !== 0 &&
                        <TableRow >
                            <TableCell></TableCell>
                            <TableCell className="text-center"></TableCell>
                            <TableCell className="text-center"></TableCell>
                            <TableCell className="text-center"></TableCell>
                            <TableCell className="text-center"></TableCell>
                            <TableCell className="text-center"></TableCell>
                            <TableCell className="text-center text-xl font-medium text-green-600">Total Salary</TableCell>
                            <TableCell className="text-center text-xl font-medium text-green-600">{employeeSalaries.reduce((sum, item) => sum + item.totalSalary, 0)}$</TableCell>
                            <TableCell>
                                <GiveSalary year={year} month={month} refetch={refetch} isGive={employeeSalaries.some(item => item.isGiven === false)}/>
                            </TableCell>
                        </TableRow>}


                </TableBody>
            </Table>
        </div>
    );
};

export default SalaryTable;