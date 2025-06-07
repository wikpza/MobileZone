import React, {useEffect, useState} from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {months} from "@/lib/utils"
import { useGetSalaryList} from "@/api/salary.api.ts";
import SalaryTable from "@/pages/admin/SalaryPage/SalaryTable.tsx";
import {GetSalaryOption} from "@/types/salary.ts";
import {isFormErrors} from "../../../../../../../../main/Compass Contract/frontend/src/lib/errors";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";




export default function SalaryPage() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const [dateOption, setDateOption] = useState<GetSalaryOption>({month:currentMonth, year:currentYear})
    const [errorOption, setErrorOption] = useState<{month:string, year:string}>({month:"", year:""})

    const {data, isLoading, refetch} = useGetSalaryList(dateOption)

    useEffect(() => {
    }, [dateOption]);

    useEffect(() => {

        if (data && data.response && data.response && isFormErrors(data.response) && data.status && data.status >= 400 && data.status < 500) {
            if ("month" in data.response.details) {
                setErrorOption({...errorOption, month: data.response.details.month.join(",") })
            } else if("year" in data.response.details){
                setErrorOption({...errorOption, year: data.response.details.year.join(",") })
            }
        }
    }, [data]);

    useEffect(() => {
        const { month, year } = dateOption;

        setErrorOption({month:"", year:""})
        // Проверка года и месяца
        if (month < 1 || month > 12) {
            setErrorOption({ ...errorOption, month: "Month must be between 1 and 12" });
            return;
        }

        if (year < 1995 || year > currentYear + 1) {
            setErrorOption({ ...errorOption, year: "Year must be between 1995 and current year" });
            return;
        }

        // Проверка, что выбранный месяц уже прошел
        if (year === currentYear + 1 && month >= currentMonth) {
            setErrorOption({ ...errorOption, month: "The selected month has not passed yet" });
            return;
        }

        refetch();
    }, [dateOption]);

    if(isLoading) return (<div>.... Loading</div>)
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Salary Management</h1>
            </div>

            <div className="bg-card p-4 rounded-lg border space-y-4">
                <h2 className="text-lg font-semibold">Generate Salary Report</h2>

                {errorOption.year !== "" &&
                    <div
                        className={`text-sm font-medium text-red-700`}>  {errorOption.year}</div>}
                {errorOption.month !== "" &&
                    <div
                        className={`text-sm font-medium text-red-700`}>  {errorOption.month}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                    <div className="flex flex-col gap-2" >
                        <label htmlFor="month-select" className={`text-sm font-medium ${errorOption.month !== "" && 'text-red-700'}`} >Month</label>
                        <Select value={dateOption.month.toString()}
                                onValueChange={(value) => setDateOption({...dateOption, month: Number(value)})}
                               >
                            <SelectTrigger id="month-select" className={` w-full ${errorOption.month !== "" && "border-red-700 border text-red-700"}`} >
                                <SelectValue placeholder="Select month"/>
                            </SelectTrigger>
                            <SelectContent >
                                {months.map((m) => (
                                    <SelectItem key={m.value} value={m.value.toString()} >
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="year-select" className={`text-sm font-medium ${errorOption.year !== "" && 'text-red-700'}`}>Year</label>


                        <Input
                            className={` w-full ${errorOption.year !== "" && "border-red-700 border text-red-700"}`}
                            type="number"
                            step="1"
                            value={dateOption.year}
                            onChange={(e) => {
                                setDateOption({...dateOption, year: parseInt(e.target.value)})
                            }
                            }
                        />
                    </div>

                    {/*<DialogReportSalary data={data?.data}/>*/}

                    {/*<div className={`flex ${isMobile ? "pt-2" : "items-end h-full"}`}>*/}
                    {/*    <Button*/}
                    {/*        onClick={generateReport}*/}
                    {/*        className="w-full">*/}
                    {/*        <FileText className="mr-2 h-4 w-4"/>*/}
                    {/*        Generate Report*/}
                    {/*    </Button>*/}
                    {/*</div>*/}

                </div>
            </div>

            {
                errorOption.month === "" && errorOption.year === "" &&
                (<div>
                    <div className={"text-2xl font-bold text-center"}>Report for {months[dateOption.month-1].label} {dateOption.year}</div>
                    <SalaryTable employeeSalaries={data && data.data? data.data : []} refetch={refetch} month={dateOption.month} year={dateOption.year}/>
                </div>)

            }


        </div>
    )
}
