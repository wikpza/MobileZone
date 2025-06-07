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
import { useGetPurchaseHistory } from "@/api/Purchase.api.ts";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { callAddFont, callAddFont2 } from "@/lib/ofont.ru_Roboto-normal.tsx";
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {GetEmployeeType} from "@/types/employee.ts";
import {addSignatureToDoc, getDocSignature} from "@/lib/utils.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";

type Props = {
    beforeDate: Date,
    toDate: Date,
    disabled: boolean,
    employee:GetEmployeeType
    signature: {
        name: string
        position: string
    }
}

const DialogReportPurchase = ({ beforeDate, toDate, disabled, signature, employee }: Props) => {
    const { data, isLoading, isError, refetch } = useGetPurchaseHistory(beforeDate, toDate);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');

    useEffect(() => {
        refetch();
    }, [beforeDate, toDate, refetch]);

    if (disabled) return <div>Cannot generate report: incorrect dates</div>;

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)

    if (isLoading) return <div>Loading data...</div>;
    if (isError || !data?.purchase) return <div>Error loading data</div>;

    const purchaseHistory = data.purchase;


    const exportToPDF = () => {
        const pdf = new jsPDF('landscape', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;

        jsPDF.API.events.push(['addFonts', callAddFont]);
        jsPDF.API.events.push(['addFonts', callAddFont2]);
        pdf.setFont('ofont.ru_Roboto');
        pdf.setFont('Roboto-Bold');
        pdf.setFontSize(18);
        pdf.text('Purchase History Report', margin, margin);

        pdf.setFont('ofont.ru_Roboto');
        pdf.setFontSize(12);
        pdf.text(`Period: ${format(beforeDate, 'MMMM dd, yyyy', { locale: enUS })} - ${format(toDate, 'MMMM dd, yyyy', { locale: enUS })}`, margin, margin + 20);

        const tableBody = purchaseHistory.map((item, index) => [
            (index + 1).toString(),
            format(new Date(item.createdAt), 'MM-dd-yyyy'),
            item.raw_material.name,
            item.quantity.toString(),
            `$${item.cost.toFixed(2)}`,
            `$${(item.quantity * item.cost).toFixed(2)}`,
            `${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.`
        ]);

        const totalCost = purchaseHistory.reduce((sum, item) => sum + item.quantity * item.cost, 0);

        autoTable(pdf, {
            startY: margin + 40,
            head: [['#', 'Date', 'Material', 'Quantity', 'Unit Cost', 'Total Cost', 'Employee']],
            body: tableBody,
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 9,
                cellPadding: 4,
                font: "ofont.ru_Roboto",
                textColor: [0, 0, 0],
                lineColor: [0, 0, 0],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineColor: [0, 0, 0],
                lineWidth: 0.5
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255]
            },
            columnStyles: {
                0: { cellWidth: 30 },
                1: { cellWidth: 70 },
                3: { cellWidth: 50 },
                4: { cellWidth: 70 },
                5: { cellWidth: 70 }
            },
            foot: [[
                '', '', '', '', 'Total:', `$${totalCost.toFixed(2)}`, ''
            ]],
            footStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineColor: [0, 0, 0],
                lineWidth: 0.5
            }
        });

        addSignatureToDoc(pdf, employee, signature);
        pdf.save(`Purchase_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.pdf`);
    };



    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData = purchaseHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'MM-dd-yyyy'),
            'Material': item.raw_material.name,
            'Quantity': item.quantity,
            'Unit Cost': item.cost,
            'Total Cost': item.quantity * item.cost,
            'Employee': `${item.employee.lastName} ${item.employee.firstName} ${item.employee.middleName}`,
            'Unit': item.raw_material.unit.name,
        }));
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Purchase History');

        // Add signature info
        const signatureInfo = [
            [],
            [`Generated on: ${format(new Date(), 'MMMM dd, yyyy', { locale: enUS })}`],
            [`${signature.name} ${signature.position}`],
            ['----------------'],
        ];
        XLSX.utils.sheet_add_aoa(worksheet, signatureInfo, { origin: -1 });

        XLSX.writeFile(workbook, `Purchase_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.xlsx`);
    };

    const exportToDoc = () => {
        const totalCost = purchaseHistory.reduce((sum, item) => sum + item.quantity * item.cost, 0);

        const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='UTF-8'>
            <title>Purchase History Report</title>
            <style>
                body { font-family: Arial, sans-serif; color: #000; }
                h1 { color: #000; }
                table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
                th { background-color: #e6e6e6; }
                .total-row td { font-weight: bold; background-color: #f9f9f9; }
                .signature { margin-top: 50px; line-height: 1.6; font-size: 12px; }
            </style>
        </head>
        <body>
            <h1>Purchase History Report</h1>
            <p>Period: ${format(beforeDate, 'MMMM dd, yyyy', { locale: enUS })} - ${format(toDate, 'MMMM dd, yyyy', { locale: enUS })}</p>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit Cost</th>
                        <th>Total Cost</th>
                        <th>Employee</th>
                    </tr>
                </thead>
                <tbody>
                    ${purchaseHistory.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${format(new Date(item.createdAt), 'MM-dd-yyyy')}</td>
                            <td>${item.raw_material.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.cost.toFixed(2)}</td>
                            <td>$${(item.quantity * item.cost).toFixed(2)}</td>
                            <td>${item.employee.lastName} ${item.employee.firstName[0]}.${item.employee.middleName[0]}.</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="5" style="text-align: right;">Total</td>
                        <td>$${totalCost.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            ${getDocSignature(employee, signature)}
        </body>
        </html>
    `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Purchase_Report_${format(beforeDate, 'yyyyMMdd')}-${format(toDate, 'yyyyMMdd')}.doc`;
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
                    Generate Purchase Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <ScrollArea className="h-[80vh] w-full">
                    <div className="p-6 bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold mb-2">
                                Purchase History Report
                            </DialogTitle>
                            <DialogDescription>
                                Period: {format(beforeDate, 'MMMM dd, yyyy', { locale: enUS })} - {format(toDate, 'MMMM dd, yyyy', { locale: enUS })}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Purchase Transactions</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-purple-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Date</TableHead>
                                            <TableHead>Material</TableHead>
                                            <TableHead className="w-[80px] text-right">Quantity</TableHead>
                                            <TableHead className="w-[100px] text-right">Unit Cost</TableHead>
                                            <TableHead className="w-[100px] text-right">Total Cost</TableHead>
                                            <TableHead>Employee</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'MM-dd-yyyy')}</TableCell>
                                                <TableCell>{item.raw_material.name}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{item.cost.toFixed(2)}</TableCell>
                                                <TableCell className="text-right">{(item.quantity * item.cost).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    {item.employee.lastName} {item.employee.firstName[0]}.{item.employee.middleName[0]}.
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center sticky bottom-0 bg-background py-2">
                        <div className="flex items-center space-x-2">
                            <span>Export As:</span>
                            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as 'pdf' | 'doc' | 'excel')}>
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

export default DialogReportPurchase;