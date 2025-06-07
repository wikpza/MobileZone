import React, {useState} from 'react';
import {Input} from "@/components/ui/input.tsx";
import DialogReportManufacturing from "@/pages/admin/ReportPage/DialogReportManufacturing.tsx";
import {GetEmployeeType} from "@/types/employee.ts";

type Props = {
    signature:{name:string, position:string},
    employee:GetEmployeeType
}
const MakeReportManufacturing = ({signature, employee}:Props) => {
    const beforeDate = new Date()
    const toDate = new Date()

    const [dateOption, setDateOption] = useState<{beforeDate:Date, toDate:Date}>({beforeDate:beforeDate, toDate:toDate})
    const [errorOption, setErrorOption] = useState<{beforeDate:string, toDate:string}>({beforeDate:"", toDate:""})

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleBeforeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setDateOption((prev) => ({ ...prev, beforeDate: newDate }));

        // Проверка, чтобы toDate была после beforeDate
        if (newDate > dateOption.toDate) {
            setErrorOption({
                beforeDate: "",
                toDate: "Дата окончания должна быть позже даты начала",
            });
        } else {
            setErrorOption({ beforeDate: "", toDate: "" });
        }
    };

    // Обработчик изменения даты окончания
    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setDateOption((prev) => ({ ...prev, toDate: newDate }));

        // Проверка, чтобы toDate была после beforeDate
        if (newDate < dateOption.beforeDate) {
            setErrorOption({
                beforeDate: "",
                toDate: "Дата окончания должна быть позже даты начала",
            });
        } else {
            setErrorOption({ beforeDate: "", toDate: "" });
        }
    };

    return (
        <div className={'shadow-box p-2 rounded-md border shadow-box'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Дата начала (beforeDate) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Дата начала</label>
                    <Input
                        type="date"
                        value={formatDateForInput(dateOption.beforeDate)}
                        onChange={handleBeforeDateChange}
                        className={errorOption.beforeDate ? "border-red-500" : ""}
                    />
                    {errorOption.beforeDate && (
                        <p className="text-red-500 text-xs">{errorOption.beforeDate}</p>
                    )}
                </div>

                {/* Дата окончания (toDate) */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Дата окончания</label>
                    <Input
                        type="date"
                        value={formatDateForInput(dateOption.toDate)}
                        onChange={handleToDateChange}
                        className={errorOption.toDate ? "border-red-500" : ""}
                    />
                    {errorOption.toDate && (
                        <p className="text-red-500 text-xs">{errorOption.toDate}</p>
                    )}
                </div>

                {/* Кнопка генерации отчета */}
                <div className={`flex pt-2`}>
                    <DialogReportManufacturing
                        employee={employee}
                        signature={signature}
                        beforeDate={dateOption.beforeDate}
                        toDate={dateOption.toDate}
                        disabled={!!errorOption.toDate} // Блокировать кнопку, если есть ошибка
                    />
                </div>
            </div>
        </div>
    );
};

export default MakeReportManufacturing;
