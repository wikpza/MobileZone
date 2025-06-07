import React, {useEffect, useState} from 'react';
import { FileText, Download } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { useGetProductManufacturing } from "@/api/manufacturing.api.ts";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {callAddFont, callAddFont2} from "@/lib/ofont.ru_Roboto-normal.tsx";
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {GetEmployeeType} from "@/types/employee.ts";
import {addSignatureToDoc, getDocSignature} from "@/lib/utils.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

type Props = {
    beforeDate: Date,
    toDate: Date,
    disabled: boolean,
    signature :{
        name:string
        position: string
},
    employee:GetEmployeeType
}

const DialogReportManufacturing = ({ beforeDate, toDate, disabled, signature, employee }: Props) => {
    const { data, isLoading, isError, refetch } = useGetProductManufacturing(beforeDate, toDate);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');


    useEffect(() => {
        refetch()
    }, [beforeDate, toDate]);

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if (disabled) return <div>Нельзя сформировать отчет: некорректные даты</div>;
    if (isLoading) return <div>Загрузка данных...</div>;
    if (isError || !data) return <div>Ошибка загрузки данных</div>;

    // Подготовка данных
    const manufacturingHistory = data.manufacturing;

    // Статистика по единицам измерения
    const unitStatistics = manufacturingHistory.reduce((acc, item) => {
        const unit = item.product.unit.name;
        acc[unit] = (acc[unit] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);

    // Статистика по сотрудникам
    const employeeStatistics = manufacturingHistory.reduce((acc, item) => {
        const employeeName = `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`;
        acc[employeeName] = (acc[employeeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Статистика по продуктам
    const productData = manufacturingHistory.reduce((acc, item) => {
        const key = `${item.product.name}|${item.product.unit.name}`;
        if (!acc[key]) {
            acc[key] = {
                name: item.product.name,
                unit: item.product.unit.name,
                quantity: 0
            };
        }
        acc[key].quantity += item.quantity;
        return acc;
    }, {} as Record<string, {name: string, unit: string, quantity: number}>);



    const exportToPDF = () => {
        const pdf = new jsPDF('landscape', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;

        pdf.setFont('helvetica');
        pdf.setFontSize(16);
        pdf.text('MANUFACTURING REPORT', margin, margin);

        pdf.setFontSize(10);
        pdf.text(`Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}`, margin, margin + 20);
        pdf.text(`Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, margin + 35);

        const bodyRows = manufacturingHistory.map((item, index) => [
            (index + 1).toString(),
            format(new Date(item.createdAt), 'dd.MM.yyyy'),
            item.product.name,
            `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`,
            item.quantity.toString(),
            item.product.unit.name
        ]);

        const totalQuantity = manufacturingHistory.reduce((sum, item) => sum + item.quantity, 0);

        // Add summary row
        bodyRows.push([
            '', '', '', 'Total:', totalQuantity.toString(), ''
        ]);

        autoTable(pdf, {
            startY: margin + 50,
            head: [['#', 'Date', 'Product', 'Employee', 'Quantity', 'Unit']],
            body: bodyRows,
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                cellPadding: 4,
                font: 'helvetica',
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                textColor: [0, 0, 0]
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.3,
                lineColor: [0, 0, 0]
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            },
            columnStyles: {
                0: { cellWidth: 30, halign: 'center' },
                1: { cellWidth: 60, halign: 'center' },
                4: { cellWidth: 50, halign: 'right' },
                5: { cellWidth: 40, halign: 'center' }
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            didDrawCell: (data) => {
                // Bold style for total row
                if (data.row.index === bodyRows.length - 1) {
                    pdf.setFont(undefined, 'bold');
                }
            }
        });

        addSignatureToDoc(pdf, employee, signature);

        pdf.save(`Manufacturing_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.pdf`);
    };


    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Табличные данные
        const mainData = manufacturingHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'dd.MM.yyyy'),
            'Product': item.product.name,
            'Employee': `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`,
            'Quantity': item.quantity,
            'Unit': item.product.unit.name
        }));

        // Создаем лист и добавляем стили вручную
        const ws = XLSX.utils.json_to_sheet(mainData);

        // Добавляем заголовки вручную с черно-белым стилем
        const headers = ['#', 'Date', 'Product', 'Employee', 'Quantity', 'Unit'];
        headers.forEach((header, i) => {
            const cellRef = XLSX.utils.encode_cell({ r: 1, c: i });
            ws[cellRef] = {
                v: header,
                t: 's',
                s: {
                    font: { bold: true, color: { rgb: '000000' } },
                    fill: { fgColor: { rgb: 'FFFFFF' } },
                    border: {
                        top: { style: 'thin', color: { rgb: '000000' } },
                        bottom: { style: 'thin', color: { rgb: '000000' } },
                        left: { style: 'thin', color: { rgb: '000000' } },
                        right: { style: 'thin', color: { rgb: '000000' } }
                    },
                    alignment: { horizontal: 'center' }
                }
            };
        });

        // Применяем стили к данным
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let R = 2; R <= range.e.r; ++R) {
            for (let C = 0; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (ws[cellRef]) {
                    ws[cellRef].s = {
                        font: { color: { rgb: '000000' } },
                        border: {
                            top: { style: 'thin', color: { rgb: '000000' } },
                            bottom: { style: 'thin', color: { rgb: '000000' } },
                            left: { style: 'thin', color: { rgb: '000000' } },
                            right: { style: 'thin', color: { rgb: '000000' } }
                        },
                        alignment: { horizontal: C === 0 || C === 1 || C === 5 ? 'center' : 'left' }
                    };
                }
            }
        }

        // Подпись

        // Устанавливаем диапазон
        ws['!ref'] = XLSX.utils.encode_range({
            s: { r: 1, c: 0 },
            e: { r: range.e.r + 4, c: range.e.c }
        });

        // Добавляем лист в книгу
        XLSX.utils.book_append_sheet(workbook, ws, 'Production History');

        // Сохраняем
        XLSX.writeFile(workbook, `Manufacturing_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.xlsx`);
    };


    const exportToDoc = () => {
        const totalQuantity = manufacturingHistory.reduce((sum, item) => sum + item.quantity, 0);

        const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>Manufacturing Report</title>
            <style>
                body { font-family: Arial, sans-serif; color: #000; }
                h1 { color: #000; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #000; }
                td { padding: 8px; border: 1px solid #000; }
                .signature { margin-top: 50px; }
            </style>
        </head>
        <body>
            <h1>Manufacturing Report</h1>
            <p>Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}</p>

            <h2>Production History</h2>
            <table>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Employee</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                </tr>
                ${manufacturingHistory.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${format(new Date(item.createdAt), 'dd.MM.yyyy')}</td>
                        <td>${item.product.name}</td>
                        <td>${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.</td>
                        <td>${item.quantity}</td>
                        <td>${item.product.unit.name}</td>
                    </tr>
                `).join('')}

                <!-- Итоговая строка -->
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Total:</td>
                    <td style="font-weight: bold;">${totalQuantity}</td>
                    <td></td>
                </tr>
            </table>

            ${getDocSignature(employee, signature)}
        </body>
        </html>
    `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Manufacturing_Report_${format(beforeDate, 'dd.MM.yyyy')}-${format(toDate, 'dd.MM.yyyy')}.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    const handleExport = () => {
        switch (exportFormat) {
            case 'pdf':
                exportToPDF();
                break;
            case 'doc':
                exportToDoc();
                break;
            case 'excel':
                exportToExcel();
                break;
            default:
                exportToPDF();
        }
    };

    return (
        <Dialog>
            <DialogTrigger>
                <Button disabled={disabled}>
                    <FileText className="mr-2 h-4 w-4" />
                    Сформировать отчет
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <ScrollArea className="h-[80vh] w-full">
                    <div className="p-6 bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold mb-2">
                                Отчет по производству
                            </DialogTitle>
                            <DialogDescription>
                                Период: {format(beforeDate, 'dd MMMM yyyy', { locale: ru })} - {format(toDate, 'dd MMMM yyyy', { locale: ru })}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Основная таблица производства */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">История производства</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">№</TableHead>
                                            <TableHead className="w-[100px]">Дата</TableHead>
                                            <TableHead>Продукт</TableHead>
                                            <TableHead>Сотрудник</TableHead>
                                            <TableHead className="w-[100px] text-center">Количество</TableHead>
                                            <TableHead className="w-[80px] text-center">Ед.изм</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {manufacturingHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell>
                                                    {item.employee.lastName} {item.employee.firstName[0]}.{item.employee.middleName[0]}.
                                                </TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-center">{item.product.unit.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Дополнительные таблицы статистики */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            {/* Статистика по единицам измерения */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">По единицам измерения</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-green-50">
                                            <TableRow>
                                                <TableHead>Единица</TableHead>
                                                <TableHead className="text-right">Количество</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(unitStatistics).map(([unit, quantity]) => (
                                                <TableRow key={unit}>
                                                    <TableCell>{unit}</TableCell>
                                                    <TableCell className="text-right">{quantity}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {/* Статистика по сотрудникам */}
                            <div>
                                <h3 className="font-semibold text-lg mb-2">По сотрудникам</h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-purple-50">
                                            <TableRow>
                                                <TableHead>Сотрудник</TableHead>
                                                <TableHead className="text-right">Участий</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Object.entries(employeeStatistics).map(([employee, count]) => (
                                                <TableRow key={employee}>
                                                    <TableCell>{employee}</TableCell>
                                                    <TableCell className="text-right">{count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                        {/* Статистика по продуктам */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">По продуктам</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-orange-50">
                                        <TableRow>
                                            <TableHead>Продукт</TableHead>
                                            <TableHead className="text-right">Количество</TableHead>
                                            <TableHead className="w-[80px]">Ед.изм</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.values(productData).map(product => (
                                            <TableRow key={product.name}>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell className="text-right">{product.quantity}</TableCell>
                                                <TableCell>{product.unit}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center sticky bottom-0 bg-background py-2">
                        <div className="flex items-center space-x-2">
                            <span>Формат:</span>
                            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'doc' | 'excel') => setExportFormat(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Формат экспорта" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="doc">Word (DOC)</SelectItem>
                                    <SelectItem value="excel">Excel (XLSX)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
                            <Download className="mr-2 h-4 w-4" />
                            Скачать
                        </Button>
                    </div>

                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default DialogReportManufacturing;