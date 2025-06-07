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
import { useGetLoanPayment } from "@/api/loan.api.ts";
import { addSignatureToDoc, getDocSignature } from "@/lib/utils.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

type Props = {
    beforeDate: Date,
    toDate: Date,
    loanId: number | null,
    disabled: boolean,
    signature: {
        name: string
        position: string
    },
    employee: GetEmployeeType
}

const DialogReportLoanPayment = ({ beforeDate, toDate, disabled, employee, signature, loanId }: Props) => {
    const { data, isLoading, isError, refetch } = useGetLoanPayment(loanId, beforeDate, toDate);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');

    useEffect(() => {
        if (loanId) {
            refetch();
        }
    }, [beforeDate, toDate, loanId]);

    if (disabled) return <div>Нельзя сформировать отчет: некорректные даты</div>;
    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if (!loanId) return <div>Не выбран кредит</div>;
    if (isLoading) return <div>Загрузка данных...</div>;
    if (isError || !data?.payment) return <div>Ошибка загрузки данных</div>;

    const paymentHistory = data.payment;
    const loanInfo = paymentHistory.length > 0 ? paymentHistory[0].loan : null;

    // Общие суммы
    const totalMainLoan = paymentHistory.reduce((sum, item) => sum + item.mainLoan, 0);
    const totalProcentSumma = paymentHistory.reduce((sum, item) => sum + item.procentSumma, 0);
    const totalPenyaSumma = paymentHistory.reduce((sum, item) => sum + item.penyaSumma, 0);
    const totalPayments = totalMainLoan + totalProcentSumma + totalPenyaSumma;

    const exportToPDF = () => {
        const pdf = new jsPDF('landscape', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;

        pdf.setFont('helvetica');
        pdf.setFontSize(16);
        pdf.text('LOAN PAYMENT REPORT', margin, margin);

        pdf.setFontSize(10);
        pdf.text(`Loan ID: ${loanId}`, margin, margin + 20);
        if (loanInfo) {
            pdf.text(`Loan Sum: ${loanInfo.loanSum.toFixed(2)}`, margin, margin + 35);
            pdf.text(`Interest Rate: ${loanInfo.procentStavka}%`, margin, margin + 50);
        }
        pdf.text(`Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}`, margin, margin + 65);
        pdf.text(`Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, margin + 80);

        const bodyRows = paymentHistory.map((item, index) => [
            (index + 1).toString(),
            format(new Date(item.giveDate), 'dd.MM.yyyy'),
            item.mainLoan.toFixed(2),
            item.procentSumma.toFixed(2),
            item.penyaSumma.toFixed(2),
            (item.mainLoan + item.procentSumma + item.penyaSumma).toFixed(2),
            item.OstatokDolga.toFixed(2),
            item.overdueDay.toString()
        ]);

        // Add summary row
        bodyRows.push([
            '', 'Total:',
            totalMainLoan.toFixed(2),
            totalProcentSumma.toFixed(2),
            totalPenyaSumma.toFixed(2),
            totalPayments.toFixed(2),
            '',
            ''
        ]);

        autoTable(pdf, {
            startY: margin + 90,
            head: [['#', 'Payment Date', 'Principal', 'Interest', 'Penalty', 'Total Payment', 'Remaining Debt', 'Overdue Days']],
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
                1: { cellWidth: 70, halign: 'center' },
                2: { cellWidth: 60, halign: 'right' },
                3: { cellWidth: 60, halign: 'right' },
                4: { cellWidth: 60, halign: 'right' },
                5: { cellWidth: 70, halign: 'right' },
                6: { cellWidth: 70, halign: 'right' },
                7: { cellWidth: 50, halign: 'center' }
            },
            didDrawCell: (data) => {
                if (data.row.index === bodyRows.length - 1) {
                    pdf.setFont(undefined, 'bold');
                }
            }
        });

        addSignatureToDoc(pdf, employee, signature);

        pdf.save(`Loan_Payment_Report_${loanId}_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.pdf`);
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Main data
        const mainData = paymentHistory.map((item, index) => ({
            '#': index + 1,
            'Payment Date': format(new Date(item.giveDate), 'dd.MM.yyyy'),
            'Principal': item.mainLoan,
            'Interest': item.procentSumma,
            'Penalty': item.penyaSumma,
            'Total Payment': item.mainLoan + item.procentSumma + item.penyaSumma,
            'Remaining Debt': item.OstatokDolga,
            'Overdue Days': item.overdueDay
        }));

        // Add summary row
        // @ts-ignore
        mainData.push({
            // "#": 0,
            // null: " ",
            // 'Payment Date': 'Total:',
            // 'Principal': totalMainLoan,
            // 'Interest': totalProcentSumma,
            // 'Penalty': totalPenyaSumma,
            // 'Total Payment': totalPayments,
            // 'Remaining Debt': '',
            // 'Overdue Days': ''
        });

        const ws = XLSX.utils.json_to_sheet(mainData);

        // Add headers with styling
        const headers = ['#', 'Payment Date', 'Principal', 'Interest', 'Penalty', 'Total Payment', 'Remaining Debt', 'Overdue Days'];
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
                            horizontal: C === 0 || C === 1 || C === 7 ? 'center' : 'right'
                        },
                        numFmt: C >= 2 && C <= 6 ? '0.00' : undefined
                    };
                }
            }
        }

        // Add loan info sheet
        if (loanInfo) {
            const loanInfoData = [
                ['Loan ID', loanId],
                ['Loan Sum', loanInfo.loanSum],
                ['Interest Rate', `${loanInfo.procentStavka}%`],
                ['Penalty Rate', `${loanInfo.penyaStavka}%`],
                ['Loan Period', `${loanInfo.periodYear} years`],
                ['Loan Start Date', format(new Date(loanInfo.takeDate), 'dd.MM.yyyy')],
                ['Status', loanInfo.statusFinished ? 'Finished' : 'Active']
            ];

            const wsLoan = XLSX.utils.aoa_to_sheet(loanInfoData);
            XLSX.utils.book_append_sheet(workbook, wsLoan, 'Loan Info');
        }

        XLSX.utils.book_append_sheet(workbook, ws, 'Payment History');
        XLSX.writeFile(workbook, `Loan_Payment_Report_${loanId}_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.xlsx`);
    };

    const exportToDoc = () => {
        const htmlContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>Loan Payment Report</title>
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
            <h1>Loan Payment Report</h1>
            <p>Loan ID: ${loanId}</p>
            ${loanInfo ? `
                <p>Loan Sum: ${loanInfo.loanSum.toFixed(2)}</p>
                <p>Interest Rate: ${loanInfo.procentStavka}%</p>
                <p>Penalty Rate: ${loanInfo.penyaStavka}%</p>
                <p>Loan Period: ${loanInfo.periodYear} years</p>
                <p>Loan Start Date: ${format(new Date(loanInfo.takeDate), 'dd.MM.yyyy')}</p>
                <p>Status: ${loanInfo.statusFinished ? 'Finished' : 'Active'}</p>
            ` : ''}
            <p>Period: ${format(beforeDate, 'dd.MM.yyyy')} - ${format(toDate, 'dd.MM.yyyy')}</p>
            <p>Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}</p>

            <h2>Payment History</h2>
            <table>
                <tr>
                    <th>#</th>
                    <th>Payment Date</th>
                    <th class="text-right">Principal</th>
                    <th class="text-right">Interest</th>
                    <th class="text-right">Penalty</th>
                    <th class="text-right">Total Payment</th>
                    <th class="text-right">Remaining Debt</th>
                    <th class="text-center">Overdue Days</th>
                </tr>
                ${paymentHistory.map((item, index) => `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${format(new Date(item.giveDate), 'dd.MM.yyyy')}</td>
                        <td class="text-right">${item.mainLoan.toFixed(2)}</td>
                        <td class="text-right">${item.procentSumma.toFixed(2)}</td>
                        <td class="text-right">${item.penyaSumma.toFixed(2)}</td>
                        <td class="text-right">${(item.mainLoan + item.procentSumma + item.penyaSumma).toFixed(2)}</td>
                        <td class="text-right">${item.OstatokDolga.toFixed(2)}</td>
                        <td class="text-center">${item.overdueDay}</td>
                    </tr>
                `).join('')}

                <tr class="total-row">
                    <td></td>
                    <td>Total:</td>
                    <td class="text-right">${totalMainLoan.toFixed(2)}</td>
                    <td class="text-right">${totalProcentSumma.toFixed(2)}</td>
                    <td class="text-right">${totalPenyaSumma.toFixed(2)}</td>
                    <td class="text-right">${totalPayments.toFixed(2)}</td>
                    <td></td>
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
        a.download = `Loan_Payment_Report_${loanId}_${format(beforeDate, 'dd.MM.yyyy')}-${format(toDate, 'dd.MM.yyyy')}.doc`;
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
                <Button disabled={disabled || !loanId}>
                    <FileText className="mr-2 h-4 w-4" />
                    Сформировать отчет
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <ScrollArea className="h-[80vh] w-full">
                    <div className="p-6 bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold mb-2">
                                Отчет по платежам по кредиту
                            </DialogTitle>
                            <DialogDescription>
                                Кредит №{loanId} | Период: {format(beforeDate, 'dd MMMM yyyy', { locale: ru })} - {format(toDate, 'dd MMMM yyyy', { locale: ru })}
                            </DialogDescription>
                            {loanInfo && (
                                <div className="mt-2 space-y-1">
                                    <p>Сумма кредита: {loanInfo.loanSum.toFixed(2)}</p>
                                    <p>Процентная ставка: {loanInfo.procentStavka}%</p>
                                    <p>Штрафная ставка: {loanInfo.penyaStavka}%</p>
                                    <p>Срок кредита: {loanInfo.periodYear} лет</p>
                                    <p>Дата получения: {format(new Date(loanInfo.takeDate), 'dd.MM.yyyy')}</p>
                                    <p>Статус: {loanInfo.statusFinished ? 'Погашен' : 'Активен'}</p>
                                </div>
                            )}
                        </DialogHeader>

                        {/* Основная таблица платежей */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">История платежей</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">№</TableHead>
                                            <TableHead className="w-[100px]">Дата платежа</TableHead>
                                            <TableHead className="text-right">Основной долг</TableHead>
                                            <TableHead className="text-right">Проценты</TableHead>
                                            <TableHead className="text-right">Пеня</TableHead>
                                            <TableHead className="text-right">Всего</TableHead>
                                            <TableHead className="text-right">Остаток долга</TableHead>
                                            <TableHead className="w-[80px] text-center">Дней просрочки</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paymentHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="text-center">{format(new Date(item.giveDate), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell className="text-right">{item.mainLoan.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{item.procentSumma.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{item.penyaSumma.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{(item.mainLoan + item.procentSumma + item.penyaSumma).toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{item.OstatokDolga.toFixed(2)}</TableCell>
                                                <TableCell className="text-center">{item.overdueDay}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="bg-gray-50 font-semibold">
                                            <TableCell colSpan={2} className="text-right">Итого:</TableCell>
                                            <TableCell className="text-right">{totalMainLoan.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{totalProcentSumma.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{totalPenyaSumma.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{totalPayments.toFixed(2)}</TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Сводная информация */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-md">
                            <h3 className="font-semibold text-lg mb-2">Сводная информация</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="font-medium">Основной долг:</p>
                                    <p className="text-xl">{totalMainLoan.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Проценты:</p>
                                    <p className="text-xl">{totalProcentSumma.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Пеня:</p>
                                    <p className="text-xl">{totalPenyaSumma.toFixed(2)}</p>
                                </div>
                                <div className="md:col-span-3">
                                    <p className="font-medium">Общая сумма платежей:</p>
                                    <p className="text-2xl">{totalPayments.toFixed(2)}</p>
                                </div>
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

export default DialogReportLoanPayment;