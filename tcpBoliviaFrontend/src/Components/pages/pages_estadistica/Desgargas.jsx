import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, ImageRun } from 'docx';
import * as XLSX from 'xlsx';
import '../../../Styles/Styles_estadisticas/descargas.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faImage, faFileWord, faFileExcel } from '@fortawesome/free-solid-svg-icons';

const Descargas = ({ targetId }) => {
  
  // Función para descargar en PDF
  const handleDownloadPDF = () => {
    const input = document.getElementById(targetId);
    if (input) {
      html2canvas(input, { scale: 2 }) // Aumentar la escala para mejor calidad
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // Ancho A4 en mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save('dinamicas.pdf');
        })
        .catch((error) => {
          console.error('Error generating PDF:', error);
        });
    } else {
      console.error('Element not found');
    }
  };

  // Función para descargar como imagen
  const handleDownloadImage = () => {
    const input = document.getElementById(targetId);
    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'dinamicas.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error generating image:', error);
        });
    } else {
      console.error('Element not found');
    }
  };

  // Función para descargar en Word
  const handleDownloadWord = () => {
    const input = document.getElementById(targetId);
    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const doc = new Document({
            sections: [
              {
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Reporte de Dinámicas",
                        bold: true,
                        size: 24,
                      }),
                      new TextRun("\n\n"),
                    ],
                  }),
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: imgData,
                        transformation: {
                          width: canvas.width / 2,
                          height: canvas.height / 2,
                        },
                      }),
                    ],
                  }),
                ],
              },
            ],
          });

          Packer.toBlob(doc).then((blob) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'dinamicas.docx';
            link.click();
          });
        })
        .catch((error) => {
          console.error('Error generating Word document:', error);
        });
    } else {
      console.error('Element not found');
    }
  };

  // Función para descargar en Excel
  const handleDownloadExcel = () => {
    const input = document.getElementById(targetId);
    if (input) {
      html2canvas(input)
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet([
            ["Reporte de Dinámicas"],
            [""],
            ["Contenido del reporte en formato imagen:"],
            [{ t: 's', v: 'Imagen', l: { Target: imgData } }], // Solo texto de referencia
          ]);

          XLSX.utils.book_append_sheet(wb, ws, 'Dinamicas');
          XLSX.writeFile(wb, 'dinamicas.xlsx');
        })
        .catch((error) => {
          console.error('Error generating Excel file:', error);
        });
    } else {
      console.error('Element not found');
    }
  };

  return (
    <div className="descargas">
     
      <i onClick={handleDownloadPDF} className="descarga-icon" title="Descargar PDF">
        <FontAwesomeIcon icon={faFilePdf} />
      </i>
      <i onClick={handleDownloadImage} className="descarga-icon" title="Descargar Imagen">
        <FontAwesomeIcon icon={faImage} />
      </i>
      <i onClick={handleDownloadWord} className="descarga-icon" title="Descargar Word">
        <FontAwesomeIcon icon={faFileWord} />
      </i>
      <i onClick={handleDownloadExcel} className="descarga-icon" title="Descargar Excel">
        <FontAwesomeIcon icon={faFileExcel} />
      </i>
    </div>
  );
};

export default Descargas;
