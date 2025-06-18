import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';

export const DownloadExcelsButton = (headers, labels, datasets, fileName) => {
    // Verificación inicial de datos
    if (!headers || !labels || !datasets || labels.length === 0 || datasets.length === 0) {
      toast.error("No hay datos disponibles para descargar.");
      return;
    }

    // Preparar los datos para la descarga
    const tableData = labels.map((label, index) => {
      const row = { [headers[0]]: label };

      datasets.forEach((dataset, i) => {
        row[dataset.label] = dataset.data[index] ?? 0;
      });

      // Calcular el total de la fila
      row['Total'] = datasets.reduce((total, dataset) => total + (dataset.data[index] || 0), 0);

      return row;
    });

    // Añadir la fila de totales al final
    const totalRow = { [headers[0]]: 'Total' };
    datasets.forEach(dataset => {
      totalRow[dataset.label] = dataset.data.reduce((sum, value) => sum + (value || 0), 0);
    });
    totalRow['Total'] = datasets.reduce((total, dataset) => total + dataset.data.reduce((sum, value) => sum + (value || 0), 0), 0);

    tableData.push(totalRow);

    // Crear la hoja de trabajo y descargar
    const worksheet = XLSX.utils.json_to_sheet(tableData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    toast.success("Archivo Excel descargado exitosamente!");
  };