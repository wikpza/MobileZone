import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReportPDFTable = () => {
  const data = [
    { id: 1, name: "Иван Петров", email: "ivan.petrov@example.com", date: "2025-04-01" },
    { id: 2, name: "Анна Смирнова", email: "anna.smirnova@example.com", date: "2025-04-03" },
    { id: 3, name: "Олег Иванов", email: "oleg.ivanov@example.com", date: "2025-04-05" },
    { id: 4, name: "Мария Кузнецова", email: "maria.kuz@example.com", date: "2025-04-06" },
    { id: 5, name: "Дмитрий Соколов", email: "dmitriy.sokolov@example.com", date: "2025-04-07" },
  ];

  const pdfRef = useRef<HTMLDivElement>(null);

  const exportPDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("report.pdf");
  };

  return (
      <div className="p-4">
        <div ref={pdfRef} className="bg-white p-4">
          <h1 className="text-xl font-bold mb-4">Отчет по пользователям</h1>
          <table className="table-auto w-full border border-gray-300 mb-4">
            <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Имя</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Дата</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{row.id}</td>
                  <td className="border px-4 py-2">{row.name}</td>
                  <td className="border px-4 py-2">{row.email}</td>
                  <td className="border px-4 py-2">{row.date}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        <button
            onClick={exportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Скачать PDF
        </button>
      </div>
  );
};

export default ReportPDFTable;
