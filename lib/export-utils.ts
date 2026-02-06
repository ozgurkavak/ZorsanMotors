import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCSV = (data: any[], filename: string) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `${filename}.csv`);
};

export const exportToExcel = (data: any[], filename: string) => {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], title: string, filename: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 15);
    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 20,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 163, 74] }, // Green color match
    });
    doc.save(`${filename}.pdf`);
};

export const printTable = (title: string, headers: string[], rows: (string | number)[][]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups to print.");
        return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #000; background: #fff; }
            h1 { text-align: center; font-size: 20px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; color: #000; }
            th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: middle; }
            th { background-color: #f8f9fa; font-weight: 600; text-transform: uppercase; font-size: 10px; }
            tr:nth-child(even) { background-color: #fff; }
            img { max-height: 40px; width: auto; display: block; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .status-badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; border: 1px solid #ddd; font-size: 9px; display: inline-block;}
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p style="text-align: center; margin-bottom: 20px; font-size: 10px; color: #666;">Generated on ${new Date().toLocaleString()}</p>
          <table>
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${rows.map(row => `
                    <tr>
                        ${row.map(cell => `<td>${cell}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { 
                setTimeout(function() {
                    window.print(); 
                    window.close(); 
                }, 500); 
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};
