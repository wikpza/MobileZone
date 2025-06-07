import React, { useEffect, useState } from 'react';
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
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GetEmployeeType } from "@/types/employee.ts";
import { useGetPurchaseHistory } from "@/api/Purchase.api.ts";
import { addSignatureToDoc, getDocSignature } from "@/lib/utils.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

type Props = {
    beforeDate: Date,
    toDate: Date,
    disabled: boolean,
    signature: {
        name: string
        position: string
    },
    employee: GetEmployeeType
}

const DialogReportProcurement = ({ beforeDate, toDate, disabled, employee, signature }: Props) => {
    const { data, isLoading, isError, refetch } = useGetPurchaseHistory(beforeDate, toDate);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');

    useEffect(() => {
        refetch()
    }, [beforeDate, toDate]);

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if (disabled) return <div>Нельзя сформировать отчет: некорректные даты</div>;
    if (isLoading) return <div>Загрузка данных...</div>;
    if (isError || !data?.purchase) return <div>Ошибка загрузки данных</div>;

    const purchaseHistory = data.purchase;

    // Статистика по единицам измерения
    const unitStatistics = purchaseHistory.reduce((acc, item) => {
        const unit = item.raw_material.unit.name;
        acc[unit] = (acc[unit] || 0) + item.quantity;
        return acc;
    }, {} as Record<string, number>);

    // Статистика по сотрудникам
    const employeeStatistics = purchaseHistory.reduce((acc, item) => {
        const employeeName = `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`;
        acc[employeeName] = (acc[employeeName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Статистика по материалам
    const materialData = purchaseHistory.reduce((acc, item) => {
        const key = `${item.raw_material.name}|${item.raw_material.unit.name}`;
        if (!acc[key]) {
            acc[key] = {
                name: item.raw_material.name,
                unit: item.raw_material.unit.name,
                quantity: 0,
                totalCost: 0
            };
        }
        acc[key].quantity += item.quantity;
        acc[key].totalCost += item.cost;
        return acc;
    }, {} as Record<string, { name: string, unit: string, quantity: number, totalCost: number }>);

    // Общая стоимость закупок
    const totalCost = purchaseHistory.reduce((sum, item) => sum + item.cost, 0);
    // Общее количество закупок
    const totalQuantity = purchaseHistory.reduce((sum, item) => sum + item.quantity, 0);

    const exportToPDF = () => {
        const pdf = new jsPDF('landscape', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;

        pdf.setFont('helvetica');
        pdf.setFontSize(16);
        pdf.text('PROCUREMENT REPORT', margin, margin);

        pdf.setFontSize(10);
        pdf.text(`Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}`, margin, margin + 20);
        pdf.text(`Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, margin + 35);
        pdf.text(`Total Cost: ${totalCost.toFixed(2)}`, margin, margin + 50);

        const bodyRows = purchaseHistory.map((item, index) => [
            (index + 1).toString(),
            format(new Date(item.createdAt), 'dd.MM.yyyy'),
            item.raw_material.name,
            `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`,
            item.quantity.toString(),
            item.raw_material.unit.name,
            `${item.cost.toFixed(2)}$`
        ]);

        // Add summary row
        bodyRows.push([
            '', '', '', 'Total:',
            totalQuantity.toString(),
            '',
            `${totalCost.toFixed(2)}$`
        ]);

        autoTable(pdf, {
            startY: margin + 60,
            head: [['#', 'Date', 'Material', 'Employee', 'Quantity', 'Unit', 'Cost']],
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
                5: { cellWidth: 40, halign: 'center' },
                6: { cellWidth: 60, halign: 'right' }
            },
            didDrawCell: (data) => {
                if (data.row.index === bodyRows.length - 1) {
                    pdf.setFont(undefined, 'bold');
                }
            }
        });

        addSignatureToDoc(pdf, employee, signature);

        pdf.save(`Procurement_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.pdf`);
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Main data
        const mainData = purchaseHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'dd.MM.yyyy'),
            'Material': item.raw_material.name,
            'Employee': `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`,
            'Quantity': item.quantity,
            'Unit': item.raw_material.unit.name,
            'Cost': item.cost,
            'Total Cost': totalCost
        }));

        const ws = XLSX.utils.json_to_sheet(mainData);

        // Add headers with styling
        const headers = ['#', 'Date', 'Material', 'Employee', 'Quantity', 'Unit', 'Cost', 'Total Cost'];
        headers.forEach((header, i) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
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

        // Apply styles to data
        const range = XLSX.utils.decode_range(ws['!ref']!);
        for (let R = 1; R <= range.e.r; ++R) {
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
                        alignment: {
                            horizontal: C === 0 || C === 1 || C === 5 ? 'center' :
                                C === 6 || C === 7 ? 'right' : 'left'
                        }
                    };
                }
            }
        }

        XLSX.utils.book_append_sheet(workbook, ws, 'Purchase History');
        XLSX.writeFile(workbook, `Procurement_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.xlsx`);
    };

    const exportToDoc = () => {
        const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>Procurement Report</title>
            <style>
                body { font-family: Arial, sans-serif; color: #000; }
                h1 { color: #000; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #000; }
                td { padding: 8px; border: 1px solid #000; }
                .signature { margin-top: 50px; }
                .total-row { font-weight: bold; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
            </style>
        </head>
        <body>
            <h1>Procurement Report</h1>
            <p>Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}</p>
            <p>Total Cost: ${totalCost.toFixed(2)}</p>

            <h2>Purchase History</h2>
            <table>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Material</th>
                    <th>Employee</th>
                    <th class="text-right">Quantity</th>
                    <th>Unit</th>
                    <th class="text-right">Cost</th>
                </tr>
                ${purchaseHistory.map((item, index) => `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${format(new Date(item.createdAt), 'dd.MM.yyyy')}</td>
                        <td>${item.raw_material.name}</td>
                        <td>${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.</td>
                        <td class="text-right">${item.quantity}</td>
                        <td class="text-center">${item.raw_material.unit.name}</td>
                        <td class="text-right">${item.cost.toFixed(2)}$</td>
                    </tr>
                `).join('')}

                <tr class="total-row">
                    <td colspan="4" style="text-align: right;">Total:</td>
                    <td class="text-right">${totalQuantity}</td>
                    <td></td>
                    <td class="text-right">${totalCost.toFixed(2)}$</td>
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
        a.download = `Procurement_Report_${format(beforeDate, 'dd.MM.yyyy')}-${format(toDate, 'dd.MM.yyyy')}.doc`;
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
                                Отчет по закупкам
                            </DialogTitle>
                            <DialogDescription>
                                Период: {format(beforeDate, 'dd MMMM yyyy', { locale: ru })} - {format(toDate, 'dd MMMM yyyy', { locale: ru })}
                            </DialogDescription>
                            <div className="text-lg font-semibold mt-2">
                                Общая стоимость: {totalCost.toFixed(2)}
                            </div>
                        </DialogHeader>

                        {/* Основная таблица закупок */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">История закупок</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">№</TableHead>
                                            <TableHead className="w-[100px]">Дата</TableHead>
                                            <TableHead>Материал</TableHead>
                                            <TableHead>Сотрудник</TableHead>
                                            <TableHead className="w-[100px] text-right">Количество</TableHead>
                                            <TableHead className="w-[80px] text-center">Ед.изм</TableHead>
                                            <TableHead className="w-[120px] text-right">Стоимость</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.raw_material.name}</TableCell>
                                                <TableCell>
                                                    {item.employee.lastName} {item.employee.firstName[0]}.{item.employee.middleName[0]}.
                                                </TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-center">{item.raw_material.unit.name}</TableCell>
                                                <TableCell className="text-right">{item.cost.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-gray-50 font-semibold">
                                            <TableCell colSpan={4} className="text-right">Итого:</TableCell>
                                            <TableCell className="text-right">{totalQuantity}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell className="text-right">{totalCost.toFixed(2)}</TableCell>
                                        </TableRow>
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
                                                <TableHead className="text-right">Закупок</TableHead>
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

                        {/* Статистика по материалам */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">По материалам</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-orange-50">
                                        <TableRow>
                                            <TableHead>Материал</TableHead>
                                            <TableHead className="text-right">Количество</TableHead>
                                            <TableHead className="w-[80px]">Ед.изм</TableHead>
                                            <TableHead className="text-right">Общая стоимость</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.values(materialData).map(material => (
                                            <TableRow key={material.name}>
                                                <TableCell>{material.name}</TableCell>
                                                <TableCell className="text-right">{material.quantity}</TableCell>
                                                <TableCell>{material.unit}</TableCell>
                                                <TableCell className="text-right">{material.totalCost.toFixed(2)}</TableCell>
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

export default DialogReportProcurement;