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
import { enUS } from "date-fns/locale";
import { callAddFont, callAddFont2 } from "@/lib/ofont.ru_Roboto-normal.tsx";
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetPersonalStatic } from "@/api/Employee.api.ts";
import {GetEmployeeType} from "@/types/employee.ts";
import AccessDeniedPage from "@/components/AccessDeniedPage.tsx";
import {addSignatureToDoc} from "@/lib/utils.ts";

type Props = {
    employeeId: number
    signature: {
        name: string
        position: string
    }
    employee:GetEmployeeType
}

export type Employee = { id: number; name: string; position: string; email: string; createdAt: Date; updatedAt: Date , employee}
export type GetSalaryList = {
    id: number;
    numSoledProduct: number;
    numCreatedProduct: number;
    numBuyMaterial: number;
    employeeId: number;
    employee: { id: number; firstName: string; lastName: string; middleName: string };
    bonus: number;
    salary: number;
    totalSalary: number;
    totalAction: number;
    isGiven: boolean;
    salaryDate: Date;
    createdAt: Date;
    updatedAt: Date
}
export type GetPurchaseType = {
    id: number;
    rawMaterialId: number;
    quantity: number;
    cost: number;
    employeeId: number;
    createdAt: Date;
    updatedAt: Date;
    raw_material: { id: number; unitId: number; name: string; unit: { id: number; name: string } };
    employee: { id: number; firstName: string; middleName: string; lastName: string }
}
export type GetManufacturingHistoryType = {
    id: number;
    productId: number;
    employeeId: number;
    quantity: number;
    employee: { id: number; firstName: string; middleName: string; lastName: string };
    product: { name: string; unit: { id: number; name: string } };
    createdAt: Date
}
export type GetProductSaleHistoryType = {
    id: number;
    productId: number;
    quantity: number;
    cost: number;
    employeeId: number;
    createdAt: Date;
    updatedAt: Date;
    product: { id: number; name: string; unitId: number; unit: { id: number; name: string } };
    employee: { id: number; firstName: string; middleName: string; lastName: string }
}

export type GetEmployeeData = {
    employee: Employee,
    salary: GetSalaryList[],
    manufacturing: GetManufacturingHistoryType[],
    purchase: GetPurchaseType[],
    sale: GetProductSaleHistoryType[]
}

const DialogReportEmployee = ({ employeeId, signature }: Props) => {
    const { data, isLoading, refetch } = useGetPersonalStatic(employeeId);
    const [exportFormat, setExportFormat] = useState<'pdf' | 'doc' | 'excel'>('pdf');

    if(data?.status && (data.status === 401 || data.status === 403 ) ) return (<AccessDeniedPage/>)
    if (isLoading) return <div>Loading employee data...</div>;
    if (!data) return <div>Failed to load employee data</div>;

    const employee = data.employees.employee;
    const salaryHistory = data.employees.salary;
    const manufacturingHistory = data.employees.manufacturing;
    const purchaseHistory = data.employees.purchase;
    const saleHistory = data.employees.sale;

    // Calculate totals
    const totalSalaryReceived = salaryHistory.reduce((sum, item) => sum + item.totalSalary, 0);
    const totalProductsManufactured = manufacturingHistory.reduce((sum, item) => sum + item.quantity, 0);
    const totalMaterialsPurchased = purchaseHistory.reduce((sum, item) => sum + item.quantity, 0);
    const totalProductsSold = saleHistory.reduce((sum, item) => sum + item.quantity, 0);
    const totalSalesAmount = saleHistory.reduce((sum, item) => sum + item.cost, 0);


    const exportToPDF = () => {
        const pdf = new jsPDF('portrait', 'pt', 'a4') as jsPDF & { lastAutoTable?: { finalY?: number } };
        const margin = 40;
        const lineHeight = 20;

        // Устанавливаем шрифт
        jsPDF.API.events.push(['addFonts', callAddFont]);
        jsPDF.API.events.push(['addFonts', callAddFont2]);
        pdf.setFont('ofont.ru_Roboto');

        // Заголовок отчета
        pdf.setFontSize(16);
        pdf.setFont('Roboto-Bold');
        pdf.text(`EMPLOYEE PERFORMANCE REPORT`, margin, margin);

        // Подзаголовок
        pdf.setFontSize(10);
        pdf.setFont('ofont.ru_Roboto');
        pdf.text(`Employee: ${employee?.firstName} ${employee.middleName} ${employee.lastName}`, margin, margin + lineHeight);
        pdf.text(`Position: ${employee.position.name}`, margin, margin + lineHeight * 1.5);
        pdf.text(`Report period: All time`, margin, margin + lineHeight * 2);
        pdf.text(`Generated on: ${format(new Date(), 'dd.MM.yyyy HH:mm')}`, margin, margin + lineHeight * 2.5);

        // Горизонтальная линия
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.line(margin, margin + lineHeight * 3, pdf.internal.pageSize.width - margin, margin + lineHeight * 3);

        // Employee Summary
        pdf.setFontSize(12);
        pdf.setFont('Roboto-Bold');
        pdf.text('1. EMPLOYEE SUMMARY', margin, margin + lineHeight * 4);
        autoTable(pdf, {
            startY: margin + lineHeight * 4.5,
            head: [['METRIC', 'VALUE']],
            body: [
                ['Total Salary Received', `${totalSalaryReceived.toFixed(2)} $`],
                ['Total Products Manufactured', totalProductsManufactured.toString()],
                ['Total Materials Purchased', totalMaterialsPurchased.toString()],
                ['Total Products Sold', totalProductsSold.toString()],
                ['Total Sales Amount', `${totalSalesAmount.toFixed(2)} $`]
            ],
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 10,
                cellPadding: 6,
                font: "ofont.ru_Roboto",
                lineColor: [0, 0, 0],
                lineWidth: 0.3,
                textColor: [0, 0, 0]
            },
            headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0.5,
                lineColor: [0, 0, 0]
            },
            bodyStyles: {
                fillColor: [255, 255, 255],
                lineWidth: 0.2
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        });

        // Salary History
        pdf.setFontSize(12);
        pdf.text('2. SALARY HISTORY', margin, (pdf.lastAutoTable?.finalY || margin) + lineHeight);
        autoTable(pdf, {
            startY: (pdf.lastAutoTable?.finalY || margin) + lineHeight * 1.5,
            head: [['#', 'DATE', 'BASE SALARY', 'BONUS', 'TOTAL SALARY', 'STATUS']],
            body: salaryHistory.map((item, index) => [
                (index + 1).toString(),
                format(new Date(item.salaryDate), 'dd.MM.yyyy'),
                `${item.salary.toFixed(2)} $`,
                `${item.bonus.toFixed(2)} $`,
                `${item.totalSalary.toFixed(2)} $`,
                item.isGiven ? 'Paid' : 'Pending'
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                font: "ofont.ru_Roboto",
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
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 70, halign: 'center' },
                2: { cellWidth: 60, halign: 'right' },
                3: { cellWidth: 50, halign: 'right' },
                4: { cellWidth: 60, halign: 'right' },
                5: { cellWidth: 40, halign: 'center' }
            },
            bodyStyles: {
                fillColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        });

        // Manufacturing History
        pdf.setFontSize(12);
        pdf.text('3. MANUFACTURING HISTORY', margin, (pdf.lastAutoTable?.finalY || margin) + lineHeight);
        autoTable(pdf, {
            startY: (pdf.lastAutoTable?.finalY || margin) + lineHeight * 1.5,
            head: [['#', 'DATE', 'PRODUCT', 'QUANTITY', 'UNIT']],
            body: manufacturingHistory.map((item, index) => [
                (index + 1).toString(),
                format(new Date(item.createdAt), 'dd.MM.yyyy'),
                item.product.name,
                item.quantity.toString(),
                item.product.unit.name
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                font: "ofont.ru_Roboto",
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
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 70, halign: 'center' },
                3: { cellWidth: 50, halign: 'right' },
                4: { cellWidth: 40, halign: 'center' }
            },
            bodyStyles: {
                fillColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        });

        // Purchase History
        pdf.setFontSize(12);
        pdf.text('4. PURCHASE HISTORY', margin, (pdf.lastAutoTable?.finalY || margin) + lineHeight);
        autoTable(pdf, {
            startY: (pdf.lastAutoTable?.finalY || margin) + lineHeight * 1.5,
            head: [['#', 'DATE', 'MATERIAL', 'QUANTITY', 'UNIT', 'COST']],
            body: purchaseHistory.map((item, index) => [
                (index + 1).toString(),
                format(new Date(item.createdAt), 'dd.MM.yyyy'),
                item.raw_material.name,
                item.quantity.toString(),
                item.raw_material.unit.name,
                `${item.cost.toFixed(2)} $`
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                font: "ofont.ru_Roboto",
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
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 70, halign: 'center' },
                3: { cellWidth: 50, halign: 'right' },
                4: { cellWidth: 40, halign: 'center' },
                5: { cellWidth: 50, halign: 'right' }
            },
            bodyStyles: {
                fillColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        });

        // Sales History
        pdf.setFontSize(12);
        pdf.text('5. SALES HISTORY', margin, (pdf.lastAutoTable?.finalY || margin) + lineHeight);
        autoTable(pdf, {
            startY: (pdf.lastAutoTable?.finalY || margin) + lineHeight * 1.5,
            head: [['#', 'DATE', 'PRODUCT', 'QUANTITY', 'UNIT', 'AMOUNT']],
            body: saleHistory.map((item, index) => [
                (index + 1).toString(),
                format(new Date(item.createdAt), 'dd.MM.yyyy'),
                item.product.name,
                item.quantity.toString(),
                item.product.unit.name,
                `${item.cost.toFixed(2)} $`
            ]),
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                font: "ofont.ru_Roboto",
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
            columnStyles: {
                0: { cellWidth: 25, halign: 'center' },
                1: { cellWidth: 70, halign: 'center' },
                3: { cellWidth: 50, halign: 'right' },
                4: { cellWidth: 40, halign: 'center' },
                5: { cellWidth: 50, halign: 'right' }
            },
            bodyStyles: {
                fillColor: [255, 255, 255]
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        });

        // Добавляем подпись
        addSignatureToDoc(pdf, employee, signature);

        // Сохраняем PDF
        pdf.save(`Employee_Performance_Report_${employee.lastName}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        // Employee Summary sheet
        const summaryData = [
            ['Employee Name', `${employee?.firstName} ${employee.middleName} ${employee.lastName}`],
            ['Position', employee.position],
            ['Total Salary Received', totalSalaryReceived],
            ['Total Products Manufactured', totalProductsManufactured],
            ['Total Materials Purchased', totalMaterialsPurchased],
            ['Total Products Sold', totalProductsSold],
            ['Total Sales Amount', totalSalesAmount],
            ['', ''],
            ['Report generated:', format(new Date(), 'dd.MM.yyyy')],
            ['Signed by:', `${signature.name} ${signature.position}`]
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

        // Salary History sheet
        const salaryData = salaryHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.salaryDate), 'dd.MM.yyyy'),
            'Base Salary': item.salary,
            'Bonus': item.bonus,
            'Total Salary': item.totalSalary,
            'Status': item.isGiven ? 'Paid' : 'Pending'
        }));
        const salarySheet = XLSX.utils.json_to_sheet(salaryData);
        XLSX.utils.book_append_sheet(workbook, salarySheet, "Salary History");

        // Manufacturing History sheet
        const manufacturingData = manufacturingHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'dd.MM.yyyy'),
            'Product': item.product.name,
            'Quantity': item.quantity,
            'Unit': item.product.unit.name
        }));
        const manufacturingSheet = XLSX.utils.json_to_sheet(manufacturingData);
        XLSX.utils.book_append_sheet(workbook, manufacturingSheet, "Manufacturing");

        // Purchase History sheet
        const purchaseData = purchaseHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'dd.MM.yyyy'),
            'Material': item.raw_material.name,
            'Quantity': item.quantity,
            'Unit': item.raw_material.unit.name,
            'Cost': item.cost
        }));
        const purchaseSheet = XLSX.utils.json_to_sheet(purchaseData);
        XLSX.utils.book_append_sheet(workbook, purchaseSheet, "Purchases");

        // Sales History sheet
        const salesData = saleHistory.map((item, index) => ({
            '#': index + 1,
            'Date': format(new Date(item.createdAt), 'dd.MM.yyyy'),
            'Product': item.product.name,
            'Quantity': item.quantity,
            'Unit': item.product.unit.name,
            'Amount': item.cost
        }));
        const salesSheet = XLSX.utils.json_to_sheet(salesData);
        XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales");

        XLSX.writeFile(workbook, `Employee_Report_${(`${employee?.firstName} ${employee.middleName} ${employee.lastName}`).replace(' ', '_')}.xlsx`);
    };

    const exportToDoc = () => {
        const htmlContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <title>Employee Performance Report</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    h1 { color: #333; }
                    table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
                    th { background-color: #f2f2f2; text-align: left; padding: 8px; border: 1px solid #ddd; }
                    td { padding: 8px; border: 1px solid #ddd; }
                    .summary { margin-bottom: 30px; }
                    .signature { margin-top: 50px; }
                </style>
            </head>
            <body>
                <h1>Employee Performance Report</h1>
                
                <div class="summary">
                    <h2>Employee Summary</h2>
                    <table>
                        <tr><td><strong>Employee Name:</strong></td><td>${`${employee?.firstName} ${employee.middleName} ${employee.lastName}`}</td></tr>
                        <tr><td><strong>Position:</strong></td><td>${employee.position.name}</td></tr>
                        <tr><td><strong>Total Salary Received:</strong></td><td>${totalSalaryReceived.toFixed(2)} $</td></tr>
                        <tr><td><strong>Total Products Manufactured:</strong></td><td>${totalProductsManufactured}</td></tr>
                        <tr><td><strong>Total Materials Purchased:</strong></td><td>${totalMaterialsPurchased}</td></tr>
                        <tr><td><strong>Total Products Sold:</strong></td><td>${totalProductsSold}</td></tr>
                        <tr><td><strong>Total Sales Amount:</strong></td><td>${totalSalesAmount.toFixed(2)} $</td></tr>
                    </table>
                </div>
                
                <h2>Salary History</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Base Salary</th>
                        <th>Bonus</th>
                        <th>Total Salary</th>
                        <th>Status</th>
                    </tr>
                    ${salaryHistory.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${format(new Date(item.salaryDate), 'dd.MM.yyyy')}</td>
                            <td>${item.salary.toFixed(2)}</td>
                            <td>${item.bonus.toFixed(2)}</td>
                            <td>${item.totalSalary.toFixed(2)}</td>
                            <td>${item.isGiven ? 'Paid' : 'Pending'}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h2>Manufacturing History</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                    </tr>
                    ${manufacturingHistory.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${format(new Date(item.createdAt), 'dd.MM.yyyy')}</td>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.product.unit.name}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h2>Purchase History</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Material</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Cost</th>
                    </tr>
                    ${purchaseHistory.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${format(new Date(item.createdAt), 'dd.MM.yyyy')}</td>
                            <td>${item.raw_material.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.raw_material.unit.name}</td>
                            <td>${item.cost.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h2>Sales History</h2>
                <table>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Amount</th>
                    </tr>
                    ${saleHistory.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${format(new Date(item.createdAt), 'dd.MM.yyyy')}</td>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.product.unit.name}</td>
                            <td>${item.cost.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </table>
                
              ${
            employee && signature.name !== "" ? `
                        <p>${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName} (${employee.position.name}) __________________________</p>
                        <p></p>
                        <br/>
                        <p>${signature.name} (${signature.position}) __________________________</p>
                        <p></p>
                    ` : `
                        <p>${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName} (${employee.position.name}) __________________________ </p>
                        <p></p>
                    `
        }
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Employee_Report_${(`${employee?.firstName} ${employee.middleName} ${employee.lastName}`).replace(' ', '_')}.doc`;
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
                <Button onClick={()=>refetch()}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Employee Report
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh]">
                <ScrollArea className="h-[80vh] w-full">
                    <div className="p-6 bg-white text-black">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold mb-2">
                                Employee Performance Report
                            </DialogTitle>
                            <DialogDescription>
                                {`${employee?.firstName} ${employee.middleName} ${employee.lastName}`} ({employee.position.name})
                            </DialogDescription>
                        </DialogHeader>

                        {/* Employee Summary */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Employee Summary</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Name</TableCell>
                                            <TableCell>{`${employee?.firstName} ${employee.middleName} ${employee.lastName}`}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Position</TableCell>
                                            <TableCell>{employee.position.name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Salary Received</TableCell>
                                            <TableCell>{totalSalaryReceived.toFixed(2)} $</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Products Manufactured</TableCell>
                                            <TableCell>{totalProductsManufactured}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Materials Purchased</TableCell>
                                            <TableCell>{totalMaterialsPurchased}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Products Sold</TableCell>
                                            <TableCell>{totalProductsSold}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Total Sales Amount</TableCell>
                                            <TableCell>{totalSalesAmount.toFixed(2)} $</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Salary History */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Salary History</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-purple-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Date</TableHead>
                                            <TableHead>Base Salary</TableHead>
                                            <TableHead>Bonus</TableHead>
                                            <TableHead>Total Salary</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salaryHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.salaryDate), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.salary.toFixed(2)}</TableCell>
                                                <TableCell>{item.bonus.toFixed(2)}</TableCell>
                                                <TableCell>{item.totalSalary.toFixed(2)}</TableCell>
                                                <TableCell>{item.isGiven ? 'Paid' : 'Pending'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Manufacturing History */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Manufacturing History</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-green-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Date</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {manufacturingHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.product.unit.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Purchase History */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Purchase History</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-orange-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Date</TableHead>
                                            <TableHead>Material</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Cost</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.raw_material.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.raw_material.unit.name}</TableCell>
                                                <TableCell>{item.cost.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Sales History */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2">Sales History</h3>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-blue-50">
                                        <TableRow>
                                            <TableHead className="w-[50px]">#</TableHead>
                                            <TableHead className="w-[100px]">Date</TableHead>
                                            <TableHead>Product</TableHead>
                                            <TableHead>Quantity</TableHead>
                                            <TableHead>Unit</TableHead>
                                            <TableHead>Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {saleHistory.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{format(new Date(item.createdAt), 'dd.MM.yyyy')}</TableCell>
                                                <TableCell>{item.product.name}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.product.unit.name}</TableCell>
                                                <TableCell>{item.cost.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center sticky bottom-0 bg-background py-2">
                        <div className="flex items-center space-x-2">
                            <span>Export format:</span>
                            <Select value={exportFormat} onValueChange={(value: 'pdf' | 'doc' | 'excel') => setExportFormat(value)}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select format" />
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
                            Export Report
                        </Button>
                    </div>

                    <ScrollBar orientation="vertical" />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default DialogReportEmployee;