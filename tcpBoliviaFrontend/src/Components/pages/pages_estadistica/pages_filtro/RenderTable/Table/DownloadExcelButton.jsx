import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

export const DownloadExcelButton = (headers, labels, data, fileName) => {
    // Verificar si los datos son válidos
    if (!headers || !labels || !data || labels.length === 0 || data.length === 0) {
      toast.error("No hay datos disponibles para descargar.");
      return;
    }

    // Depuración: Verificar las entradas
    console.log("Headers:", headers);
    console.log("Labels:", labels);
    console.log("Data:", data);

    // Preparar datos para la hoja de cálculo
    const tableData = labels.map((label, index) => {
      return {
        [headers[0]]: label, // Primera columna: Label
        [headers[1]]: data[index] ?? 0, // Segunda columna: Cantidad
      };
    });

    // Sumar la cantidad total
    const total = data.reduce((acc, curr) => acc + (curr ?? 0), 0);

    // Añadir fila de totales
    const totalRow = {
      [headers[0]]: "Total", // Etiqueta para la fila de total
      [headers[1]]: total,   // Total de casos
    };
    tableData.push(totalRow);

    // Crear la hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(tableData);

    // Crear el libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // Exportar archivo Excel
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    // Notificar éxito
    toast.success("Archivo Excel descargado exitosamente!");
  };