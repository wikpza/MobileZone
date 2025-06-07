import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import RobotFont from './ofont.ru_Roboto.ttf'
import {GetEmployeeType} from "@/types/employee.ts";
import jsPDF from "jspdf";
import {format} from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

export const getDocSignature = (employee:GetEmployeeType,  signature :{ name:string, position: string} ) =>{
  return  employee && signature.name !== "" ? `
                        <p> ${signature.position} _____________ ${signature.name} </p>
                        <p></p>
                        <p> ${employee.position.name} _____________ ${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName} </p>
                        <p></p>  
                    ` : `
                        <p> ${employee.position.name} _____________ ${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName}</p>
                        <p></p>
                    `
}


export const addSignatureToDoc = (doc: jsPDF, employee:GetEmployeeType,  signature :{ name:string, position: string} ) => {
  const currentY = (doc as any).lastAutoTable?.finalY || 40;
  const startY = currentY + 30;

  doc.setFontSize(10);

  let y = startY;

  // 📌 Блок: Кто сформировал отчёт
  if (employee && signature.name !== "") {
    const fullName = `${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName}`;
    const position = employee.position.name;

    // doc.text("Report created by:", 40, y);
    // y += 10;
    doc.text(`${signature.position} ______________ ${signature.name}`, 40, y);

    // y += 10;
    doc.text("", 40, y);
    y += 25;
    doc.text(`${position}  ______________ ${fullName}`, 40, y);

    // doc.text("Signed by:", 40, y);
    // y += 10;
    // y += 10;
    // doc.text("", 40, y);
    // y += 25;
  }else{
    const fullName = `${employee.firstName[0]}.${employee.middleName[0]}.${employee.lastName}`;
    const position = employee.position.name;


    doc.text(`${position} __________________________ ${fullName}`, 40, y);
    // y += 10;
    doc.text("", 40, y);
    y += 25;
  }

  // 📌 Дата
  // doc.text(`Report generated: ${format(new Date(), 'dd.MM.yyyy')}`, 40, y + 10);
};

