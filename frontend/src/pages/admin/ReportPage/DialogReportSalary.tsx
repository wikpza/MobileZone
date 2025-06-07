import React, { useState } from 'react';
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
import RobotFont from '../../../lib/ofont.ru_Roboto.ttf';
import { callAddFont, callAddFont2 } from "@/lib/ofont.ru_Roboto-normal.tsx";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { GetSalaryList } from "@/types/salary.ts";
import {GetEmployeeType} from "@/types/employee.ts";
import {addSignatureToDoc, getDocSignature} from "@/lib/utils.ts";

type Props = {
    data: GetSalaryList[],
    signature: { name: string, position: string },
    employee:GetEmployeeType
}

const DialogReportSalary = ({ data, signature, employee }: Props) => {
    const totalSalary = data.reduce((sum, entry) => sum + entry.totalSalary, 0);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');

    const exportToPDF = () => {
        const pdf = new jsPDF('landscape', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;

        jsPDF.API.events.push(['addFonts', callAddFont]);
        jsPDF.API.events.push(['addFonts', callAddFont2]);

        pdf.setFont('ofont.ru_Roboto');
        pdf.setFont('Roboto-Bold');
        pdf.setFontSize(18);
        pdf.text('Salary Report', margin, margin);

        pdf.setFontSize(12);
        pdf.text(`Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, margin + 20);

        // Считаем итоговые суммы
        const totalBonus = data.reduce((sum, item) => sum + item.bonus, 0);
        const totalSalary = data.reduce((sum, item) => sum + item.salary, 0);
        const totalTotalSalary = data.reduce((sum, item) => sum + item.totalSalary, 0);

        autoTable(pdf, {
            startY: margin + 40,
            head: [['#', 'Employee Name', 'Created', 'Sold', 'Purchased', 'Bonus', 'Salary', 'Total Salary']],
            body: data.map((item, index) => [
                (index + 1).toString(),
                `${item.employee.lastName} ${item.employee.firstName}`,
                item.numCreatedProduct.toString(),
                item.numSoledProduct.toString(),
                item.numBuyMaterial.toString(),
                `${item.bonus.toFixed(2)}$`,
                `${item.salary.toFixed(2)}$`,
               `${ item.totalSalary.toFixed(2)}$`
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                font: 'ofont.ru_Roboto',
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.2,
                cellPadding: 4,
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineColor: [0, 0, 0],
                lineWidth: 0.3,
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            foot: [[
                '', '', '', '', 'Total:',
                `${totalBonus.toFixed(2)}$`,
               `${ totalSalary.toFixed(2)}$`,
               `${ totalTotalSalary.toFixed(2)}$`
            ]],
            footStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineColor: [0, 0, 0],
                lineWidth: 0.3,
            }
        });

        addSignatureToDoc(pdf, employee, signature);
        pdf.save(`Salary_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
    };


    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData = data.map((item, index) => ({
            '#': index + 1,
            'Employee Name': `${item.employee.lastName} ${item.employee.firstName}`,
            'Created': item.numCreatedProduct,
            'Sold': item.numSoledProduct,
            'Purchased': item.numBuyMaterial,
            'Bonus': item.bonus,
            'Salary': item.salary,
            'Total Salary': item.totalSalary,
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Salary Data');

        // Add total salary row
        const totalRow = {
            '#': '',
            'Employee Name': 'Total',
            'Created': '',
            'Sold': '',
            'Purchased': '',
            'Bonus': '',
            'Salary': '',
            'Total Salary': totalSalary,
        };
        XLSX.utils.sheet_add_json(worksheet, [totalRow], { header: Object.keys(totalRow), skipHeader: true, origin: -1 });

    };

    const exportToDoc = () => {
        const totalBonus = data.reduce((sum, item) => sum + item.bonus, 0);
        const totalSalary = data.reduce((sum, item) => sum + item.salary, 0);
        const totalTotalSalary = data.reduce((sum, item) => sum + item.totalSalary, 0);

        const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset='UTF-8'>
        <title>Salary Report</title>
        <style>
            body { font-family: Arial, sans-serif; color: #000; }
            h1 { color: #000; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-row td { font-weight: bold; background-color: #fafafa; }
            .signature { margin-top: 50px; line-height: 1.6; font-size: 12px; }
        </style>
    </head>
    <body>
        <h1>Salary Report</h1>
        <p>Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Employee Name</th>
                    <th>Created</th>
                    <th>Sold</th>
                    <th>Purchased</th>
                    <th>Bonus</th>
                    <th>Salary</th>
                    <th>Total Salary</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.employee.lastName} ${item.employee.firstName}</td>
                        <td>${item.numCreatedProduct}</td>
                        <td>${item.numSoledProduct}</td>
                        <td>${item.numBuyMaterial}</td>
                        <td>${item.bonus.toFixed(2)}$</td>
                        <td>${item.salary.toFixed(2)}$</td>
                        <td>${item.totalSalary.toFixed(2)}$</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td colspan="5" style="text-align: right;">Total</td>
                    <td>${totalBonus.toFixed(2)}$</td>
                    <td>${totalSalary.toFixed(2)}$</td>
                    <td>${totalTotalSalary.toFixed(2)}$</td>
                </tr>
            </tbody>
        </table>
        ${getDocSignature(employee, signature)}
    </body>
    </html>
    `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        saveAs(blob, `Salary_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.doc`);
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
                <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Salary Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <ScrollArea className="h-[80vh] w-full">
                    <div className="p-6 bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold mb-2">Salary Report</DialogTitle>
                            <DialogDescription>
                                Generated on: {format(new Date(), 'MMMM dd, yyyy')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead>Employee Name</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Sold</TableHead>
                                            <TableHead>Purchased</TableHead>
                                            <TableHead>Bonus</TableHead>
                                            <TableHead>Salary</TableHead>
                                            <TableHead>Total Salary</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.employee.lastName} {item.employee.firstName}</TableCell>
                                                <TableCell>{item.numCreatedProduct}</TableCell>
                                                <TableCell>{item.numSoledProduct}</TableCell>
                                                <TableCell>{item.numBuyMaterial}</TableCell>
                                                <TableCell>{item.bonus.toFixed(2)}</TableCell>
                                                <TableCell>{item.salary.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalSalary.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-semibold bg-gray-100">
                                            <TableCell colSpan={7} className="text-right">Total</TableCell>
                                            <TableCell>{totalSalary.toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center sticky bottom-0 bg-background py-2">
                        <div className="flex items-center space-x-2">
                            <span>Export As:</span>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Export Format" />
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
                            Download
                        </Button>
                    </div>

                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default DialogReportSalary;