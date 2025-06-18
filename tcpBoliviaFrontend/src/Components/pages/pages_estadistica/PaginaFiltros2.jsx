import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';

import "../../../Styles/Styles_estadisticas/Inicio.css";
import "../../../Styles/Styles_estadisticas/mapaBo.css";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  // Importar PointElement
  LineElement,   // Importar LineElement (necesario para gráficos de líneas)
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los elementos necesarios
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,  // Registrar PointElement
  LineElement,   // Registrar LineElement
  Title,
  Tooltip,
  Legend
);
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip as MuiTooltip } from '@mui/material';


const PaginaFiltro = () => {
  const chartRef = useRef();
  const [chartKey, setChartKey] = useState(0); // Estado para controlar la clave única

  const [chartData1, setChartData1] = useState({ labels: [], datasets: [] });
  const [chartData2, setChartData2] = useState({ labels: [], datasets: [] });
  const [chartData3, setChartData3] = useState({ labels: [], datasets: [] });
  const [chartData4, setChartData4] = useState({ labels: [], datasets: [] });
  const [chartData5, setChartData5] = useState({ labels: [], datasets: [] });
  const [chartData6, setChartData6] = useState({ labels: [], datasets: [] });
  const [chartData7, setChartData7] = useState({ labels: [], datasets: [] });
  const [chartData8, setChartData8] = useState({ labels: [], datasets: [] });

  const [departments, setDepartments] = useState([]);

  const [tiemposResolucion, setTiemposResolucion] = useState([]);

  const [yearsIngreso, setYearsIngreso] = useState([]); // Años únicos para el select

  const [selectedFechaIngreso, setSelectedFechaIngreso] = useState('');
  const [dataResFondoVoto, setDataResFondoVoto] = useState([]);
  const [selectedResFondoVoto, setSelectedResFondoVoto] = useState('');
  //const [resEmisor, setResEmisor]=useState([]);
  const [resEmisorOptions, setResEmisor] = useState([]); // Para almacenar las opciones de resEmisor
  const [selectedResEmisor, setSelectedResEmisor] = useState(''); // Para almacenar el resEmisor seleccionado

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [totalCases, setTotalCases] = useState(0);
  const [error, setError] = useState(null);
  const [accionConst2Options, setAccionConst2Options] = useState([]);
  const [selectedAccionConst2, setSelectedAccionConst2] = useState('');
  const [viewType, setViewType] = useState('chart');
  const [chartType, setChartType] = useState('bar');
  const [currentChart, setCurrentChart] = useState('chart1');
  const [selectedYear, setSelectedYear] = useState('');
  const [years, setYears] = useState([]);
  const [originalChartData4, setOriginalChartData4] = useState({ labels: [], datasets: [] });
  const [restipo2Options, setRestipo2Options] = useState([]);
  const [selectedRestipo2, setSelectedRestipo2] = useState('');
  const [originalChartData3, setOriginalChartData3] = useState([]);

  const [filteredChartData3, setFilteredChartData3] = useState([]);
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  //DESCARGA PARA LAS GRAFICAS
  const handleDownload = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const canvas = chart.canvas;
  
      // Crear un lienzo temporal más grande para incluir la descripción
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
  
      const description = document.querySelector('.chart-description')?.textContent || '';
      const padding = 20; // Espacio entre la gráfica y el texto
      const fontSize = 16; // Tamaño de la fuente para el texto
  
      // Configurar el tamaño del nuevo lienzo
      tempCanvas.width = canvas.width+2+padding;
      tempCanvas.height = canvas.height + fontSize * 2 + padding;
  
      // Dibujar fondo blanco
      tempContext.fillStyle = 'white';
      tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
      // Dibujar la gráfica en el lienzo temporal
      tempContext.drawImage(canvas, 0, 0);
  
      // Dibujar la descripción debajo de la gráfica
      tempContext.fillStyle = 'black';
      tempContext.font = `${fontSize}px Arial`;
      tempContext.fillText(
        description,
        10, // Margen izquierdo
        canvas.height + fontSize + padding / 2 // Posición debajo de la gráfica
      );
  
      // Convertir el lienzo temporal a una imagen
      const imageUrl = tempCanvas.toDataURL('image/png');
  
      // Descargar la imagen
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'grafico.png';
      link.click();
    }
  };
  
  
    

  //DESCARGA PARA TABLAS 
  const downloadExcel = (headers, labels, data, fileName) => {
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
  

  const downloadExcels = (headers, labels, datasets, fileName) => {
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener departamentos y casos
        const departmentsResponse = await axios.get('http://localhost:8000/api/departamentos');
        setDepartments(departmentsResponse.data);
        const casesResponse = await axios.get('http://localhost:8000/api/casos', { params: { order: 'asc' } });
        formatChartData1(casesResponse.data);

        const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', { params: { order: 'asc' } });
        formatChartData2(municipioResponse.data);
        // Obtener resoluciones por departamento y tipo
        const resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/departamento-tipo');
        formatChartData3(resolucionesResponse.data);
        // Obtener cantidad de resoluciones por año y mes
        const resolucionesPorFechaResponse = await axios.get('http://localhost:8000/api/resoluciones/por-fecha');
        formatChartData4(resolucionesPorFechaResponse.data);
        // Obtener años únicos para el select de años
        const uniqueYears = [...new Set(resolucionesPorFechaResponse.data.map(item => item.anio))];
        setYears(uniqueYears);
        // Obtener resoluciones por accion_const y accion_const2
        const resolucionesPorAccionConstResponse = await axios.get('http://localhost:8000/api/resoluciones/por-accion-constitucional');
        formatChartData5(resolucionesPorAccionConstResponse.data);
        // Cargar opciones para el select de acción constitucional 2
        const accionConst2Response = await axios.get('http://localhost:8000/api/acciones-constitucionales'); // Asegúrate de que esta URL sea correcta
        setAccionConst2Options(accionConst2Response.data);

        const tipoResolucionResponse = await axios.get('http://localhost:8000/api/resoluciones/tipo');
        const uniqueTipos = Array.from(new Set(tipoResolucionResponse.data.map(tipo => tipo.tipo_resolucion2)))
          .map(tipo => tipoResolucionResponse.data.find(t => t.tipo_resolucion2 == tipo));
        setRestipo2Options(uniqueTipos); // Solo tipos únicos

        // Obtener datos para resEmisor
        const resEmisorResponse = await axios.get('http://localhost:8000/api/resEmisor');
        setResEmisor(resEmisorResponse.data);

        // Obtener datos para casos por resEmisor
        const casosPorResEmisorResponse = await axios.get('http://localhost:8000/api/casosPorResEmisor');
        formatChartData6(casosPorResEmisorResponse.data); // Ajusta esta función si necesitas formatear los datos para `chartData6`


        // Solicita todos los casos agrupados por fecha de ingreso
        const casosPorFechaIngresoResponse = await axios.get('http://localhost:8000/api/casos/por-fecha');
        // Formatear datos para el gráfico, si es necesario
        formatChartData7(casosPorFechaIngresoResponse.data);
        // Obtener años únicos para el select
        const casosYears = [...new Set(casosPorFechaIngresoResponse.data.map(item => item.anio))];
        setYearsIngreso(casosYears);

        const response = await axios.get('http://localhost:8000/api/tiemposResolucion');
        setTiemposResolucion(response.data);

        //obtener la cantidad de resoluiones por res_fondo_voto 
        const resolucionesPorResFondoVoto = await axios.get('http://localhost:8000/api/resolucionPorResFondo');
        setDataResFondoVoto(resolucionesPorResFondoVoto.data);
        formatChartData8(resolucionesPorResFondoVoto.data);

      } catch (error) {
        console.error('Error fetching data', error);
        setError('Error fetching data');
      }

    };
    fetchData();
  }, []);



  const handleResFondoVotoChange = async (e) => {
    const resFondoVoto = e.target.value;
    setSelectedResFondoVoto(resFondoVoto);
    try {
      // Solicita los datos con el filtro res_fondo_voto
      const response = await axios.get('http://localhost:8000/api/resolucionPorResFondo', {
        params: { res_fondo_voto: resFondoVoto },
      });

      console.log(response.data); // Verifica los datos obtenidos

      // Llama a la función para formatear los datos y actualizar el gráfico
      formatChartData8(response.data);
    } catch (error) {
      console.error('Error al obtener datos para resFondoVoto', error);
    }
  };
  // Manejar el cambio de selección de año
  const handleFechaIngresoChange = async (e) => {
    const selectedYear = e.target.value;
    setSelectedFechaIngreso(selectedYear);

    try {
      // Si no se selecciona un año específico (es decir, seleccionamos la opción por defecto)
      if (selectedYear === '') {
        // Obtener todos los datos nuevamente
        const response = await axios.get('http://localhost:8000/api/casos/por-fecha');
        formatChartData7(response.data);
      } else {
        // Filtrar los datos para el año seleccionado
        const response = await axios.get('http://localhost:8000/api/casos/por-fecha');
        const filteredData = response.data.filter(caso => caso.anio === parseInt(selectedYear));
        formatChartData7(filteredData);
      }
    } catch (error) {
      console.error('Error al obtener datos para fecha de ingreso', error);
      setError('Error al obtener datos para fecha de ingreso');
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    try {
      const response = await axios.get('http://localhost:8000/api/casos', {
        params: { departamento_id: departmentId, order: 'asc' }
      });
      formatChartData1(response.data);

      const municipioResponse = await axios.get('http://localhost:8000/api/casos/municipios', {
        params: { departamento_id: departmentId }
      });
      formatChartData2(municipioResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const handleResEmisorChange = async (e) => {
    const resEmisorId = e.target.value;
    setSelectedResEmisor(resEmisorId);

    try {
      // Solicitar datos de casos filtrados por el emisor seleccionado
      const casesByResEmisorResponse = await axios.get('http://localhost:8000/api/casosPorResEmisor', {
        params: { res_emisor_id: resEmisorId }
      });
      formatChartData6(casesByResEmisorResponse.data);

    } catch (error) {
      console.error('Error fetching data for resEmisor', error);
      setError('Error fetching data for resEmisor');
    }
  };


  

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (year) {
      // Filtrar etiquetas y datos para el año seleccionado
      const filteredLabels = originalChartData4.labels.filter(label => {
        // Extraer el año de la etiqueta, asumiendo que tiene formato "AAAA - Mes"
        const labelYear = label.split(' - ')[0];
        return labelYear === year; // Comparar con el año seleccionado
      });
      const filteredData = originalChartData4.datasets[0].data.filter((_, index) => {
        const labelYear = originalChartData4.labels[index].split(' - ')[0];
        return labelYear === year; // Filtrar solo los datos correspondientes al año
      });


      setChartData4({
        labels: filteredLabels,
        datasets: [
          {
            label: `Resoluciones del año ${year}`,
            data: filteredData,
            borderColor: 'rgba(255, 206, 86, 0.6)',
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
            fill: true,
            tension: 0.4,
            maxBarThickness: 50,
          },
        ],
      });
    } else {
      setChartData4(originalChartData4);
    }
  };
  const handleRestipo2Change = (e) => {
    const tipoResolucion = e.target.value;
    console.log('Selected Resolucion Type:', tipoResolucion);
    setSelectedRestipo2(tipoResolucion);

    console.log('Original Data for Chart 3 before filtering:', originalChartData3);

    if (tipoResolucion === "") {
      // Restaurar todos los datos si se selecciona "todos"
      console.log('No Resolucion Type selected, restoring original data for Chart 3');
      setFilteredChartData3(originalChartData3); // Restore all data
      formatChartData3(originalChartData3); // Formatea la gráfica con datos originales
    } else {
      // Filtrar los datos basados en el tipo de resolución seleccionado
      const filteredData = originalChartData3.filter(item => {
        const itemTipoResolucion = item.tipo_resolucion2.toString(); // Asegúrate de convertir a cadena
        console.log(`Comparing: ${itemTipoResolucion} with ${tipoResolucion}`);
        return itemTipoResolucion === tipoResolucion; // Comparación ajustada
      });

      if (filteredData.length === 0) {
        console.log('No data found for the selected Resolucion Type');
        setChartData3({ labels: [], datasets: [] });
        setError('No valid data for chart 3');
      } else {
        console.log('Filtered Data for Chart 3:', filteredData);
        setFilteredChartData3(filteredData); // Guardamos los datos filtrados
        formatChartData3(filteredData); // Llamada a la función para formatear los datos filtrados
      }
    }
  };
  const handleAccionConst2Change = async (e) => {
    const accionConst2Id = e.target.value;
    console.log('Selected Accion Const2 ID:', accionConst2Id); // Agregar esta línea
    setSelectedAccionConst2(accionConst2Id);
    try {
      let resolucionesResponse;
      if (accionConst2Id) {
        resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/accion-const', {
          params: { accion_const2_id: accionConst2Id, order: 'asc' }
        });
      } else {
        resolucionesResponse = await axios.get('http://localhost:8000/api/resoluciones/accion-const', {
          params: { order: 'asc' } // O solo omite el ID
        });
      }
      formatChartData5(resolucionesResponse.data);
    } catch (error) {
      console.error('Error fetching data', error);
      setError('Error fetching data');
    }
  };

  const formatChartData1 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format');
      setError('Invalid data format');
      return;
    }

    const labels = data.map(item => item.departamento);
    const counts = data.map(item => item.cantidad_casos);
    const total = counts.reduce((acc, curr) => acc + curr, 0);

    setTotalCases(total);
    setChartData1({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
         // backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`), // Generar colores aleatorios
          borderRadius: 5,  // Bordes redondeados
          maxBarThickness: 40,  // Ajuste de grosor de barras
        },
      ],

    });
  };

  const formatChartData2 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format');
      return;
    }
  
    // Modificar las etiquetas para cambiar 'Capital 1' a 'Capital-[Departamento]'
    const labels = data.map(item => {
      // Verificar si el municipio es 'Capital 1', 'Capital 2', ..., 'Capital 9'
      if (/^Capital [1-9]$/.test(item.municipio)) {
        return `Capital-${item.departamento}`; // Reemplazar por 'Capital-[Departamento]'
      }
      return item.municipio; // Si no es 'Capital', mantener el nombre original
    });
  
    // Mantener el conteo de casos tal cual como estaba
    const counts = data.map(item => item.cantidad_de_casos);
  
    // Actualizar el estado con los datos procesados
    setChartData2({
      labels,
      datasets: [
        {
          label: 'Cantidad de Casos por Municipio/Departamento',
          data: counts,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          maxBarThickness: 50,
        },
      ],
    });
  };
  
  const formatChartData3 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format for Chart 3');
      setError('Invalid data format');
      return;
    }

    // Guarda los datos originales antes de filtrar
    setOriginalChartData3(data); // Asegúrate de que aquí tengas los datos originales

    // Filtrar datos válidos para la gráfica
    const validData = data.filter(item =>
      item.departamento &&
      item.tipo_resolucion2 &&
      item.sub_tipo_resolucion &&
      item.cantidad_resoluciones !== null &&
      item.cantidad_resoluciones >= 0
    );

    if (validData.length === 0) {
      console.log('No valid data for chart 3');
      setChartData3({ labels: [], datasets: [] });
      setError('No valid data for chart 3');
      return;
    }

    const labels = validData.map(item => `${item.departamento} - ${item.tipo_resolucion2} - ${item.sub_tipo_resolucion}`);
    const counts = validData.map(item => item.cantidad_resoluciones);
    setChartData3({
      labels,  // Etiquetas del gráfico
      datasets: [
        {
          label: 'Cantidad de Resoluciones',
          data: counts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',  // Color de fondo suave y atractivo
         // borderColor: 'rgba(153, 102, 255, 1)',  // Color del borde de las barras
          borderWidth: 1,  // Grosor del borde de las barras
          borderRadius: 5,  // Bordes redondeados para un toque más moderno
          maxBarThickness: 50,  // Ajustar el grosor máximo de las barras
        },
      ],
    });

    const options = {
      responsive: true,  // Asegura que la gráfica sea responsiva
      maintainAspectRatio: false,  // Mantener proporciones cuando cambie el tamaño
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw + " resoluciones";  // Personalizar el formato del tooltip
            },
          },
        },
        legend: {
          position: 'top',  // Colocar la leyenda en la parte superior
          labels: {
            color: 'rgba(0, 0, 0, 0.7)',  // Color del texto de la leyenda
            font: {
              size: 14,  // Tamaño de la fuente de la leyenda
              family: 'Arial, sans-serif',  // Tipo de fuente
            },
          },
        },
        title: {
          display: true,
          text: 'Cantidad de Resoluciones',  // Título del gráfico
          font: {
            size: 18,  // Tamaño de la fuente del título
            family: 'Arial, sans-serif',  // Tipo de fuente
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave para las líneas del eje X
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave para las líneas del eje Y
          },
          ticks: {
            font: {
              size: 12,  // Tamaño de la fuente de las etiquetas del eje Y
              family: 'Arial, sans-serif',  // Tipo de fuente
            },
            callback: function (value) {
              return value.toLocaleString();  // Agregar separadores de miles en los valores del eje Y
            },
          },
        },
      },
      animation: {
        duration: 1000,  // Duración de la animación (1 segundo)
        easing: 'easeOutBounce',  // Efecto de rebote cuando aparece la gráfica
      },
    };

  };

  const formatChartData4 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format');
      return;
    }
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const labels = data.map(item => `${item.anio} - ${monthNames[item.mes - 1]}`); // Ajustamos aquí
    const counts = data.map(item => item.cantidad_resoluciones);
    setOriginalChartData4({
      labels,
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Fecha',
          data: counts,
          backgroundColor: 'rgba(255, 206, 86, 0.6)', // Color personalizable
          maxBarThickness: 50,
        },
      ],
    });

    setChartData4({
      labels,  // Etiquetas de la gráfica
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Fecha',
          data: counts,
          backgroundColor: 'rgba(255, 206, 86, 0.6)', // Color de las barras, puedes ajustarlo como prefieras
          borderColor: 'rgba(255, 206, 86, 1)', // Borde de las barras para mayor contraste
          borderWidth: 1,  // Grosor del borde de las barras
          borderRadius: 5,  // Bordes redondeados
          maxBarThickness: 50,  // Control de grosor máximo de las barras
        },
      ],
    });

    const options = {
      responsive: true,  // Asegura que la gráfica sea responsiva
      maintainAspectRatio: false,  // Mantiene las proporciones cuando se cambia el tamaño
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw + " resoluciones";  // Personalización de los tooltips
            },
          },
        },
        legend: {
          position: 'top',  // Coloca la leyenda en la parte superior
          labels: {
            color: 'rgba(0, 0, 0, 0.7)',  // Color de la leyenda
            font: {
              size: 14,  // Tamaño de la fuente de la leyenda
              family: 'Arial, sans-serif',  // Tipo de fuente de la leyenda
            },
          },
        },
        title: {
          display: true,
          text: 'Cantidad de Resoluciones por Fecha',  // Título de la gráfica
          font: {
            size: 18,  // Tamaño de la fuente del título
            family: 'Arial, sans-serif',  // Tipo de fuente
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje X
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje Y
          },
          ticks: {
            font: {
              size: 12,  // Tamaño de la fuente de las etiquetas del eje Y
              family: 'Arial, sans-serif',  // Tipo de fuente de las etiquetas del eje Y
            },
            callback: function (value) {
              return value.toLocaleString();  // Agrega separadores de miles a las etiquetas del eje Y
            },
          },
        },
      },
      animation: {
        duration: 1000,  // Duración de la animación (1 segundo)
        easing: 'easeOutBounce',  // Efecto de rebote al cargar la gráfica
      },
    };


  };
  const formatChartData5 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format');
      return;
    }
    const labels = data.map(item => `${item.accion_const2_nombre} - ${item.accion_const_nombre}`);
    const counts = data.map(item => item.cantidad_resoluciones);

    setChartData5({
      labels,
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Acción Constitucional',
          data: counts,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          maxBarThickness: 50,
        },
      ],
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              // Rotar las etiquetas a 45 grados
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
            },
          },
        },
      },
    });
  };

  // Configuración de opciones para Chart.js
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,     // Rotar etiquetas para que se vean mejor
          minRotation: 45,
          autoSkip: true,       // Omitir algunas etiquetas si son muy largas
          font: {
            size: 10,           // Reducir el tamaño de la fuente para etiquetas largas
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de Resoluciones',
        },
      },
    },
  };


  const formatChartData6 = (data) => {
    if (!data || !Array.isArray(data)) {
      setError('Invalid data format for resEmisor');
      return;
    }

    // Ajusta estos nombres de campos (`nombre_emisor` y `cantidad_casos`) según la estructura de tu respuesta `resEmisor`
    const labels = data.map(item => item.resEmisor);
    const counts = data.map(item => item.cantidad_casos_Emisor);

    setChartData6({
      labels,  // Etiquetas de la gráfica (por ejemplo, los emisores)
      datasets: [
        {
          label: 'Cantidad de Casos por Emisor',
          data: counts,  // Datos de la cantidad de casos
          backgroundColor: 'rgba(153, 102, 255, 0.6)',  // Color de las barras
          borderColor: 'rgba(153, 102, 255, 1)',  // Borde de las barras para mejor contraste
          borderWidth: 1,  // Grosor del borde de las barras
          borderRadius: 5,  // Bordes redondeados para un diseño moderno
          maxBarThickness: 50,  // Control de grosor máximo de las barras
        },
      ],
    });

    // Opciones adicionales para la gráfica
    const options = {
      responsive: true,  // Asegura que la gráfica sea responsiva
      maintainAspectRatio: false,  // Mantiene las proporciones cuando cambia el tamaño
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw + " casos";  // Personalización de los tooltips
            },
          },
        },
        legend: {
          position: 'top',  // Coloca la leyenda en la parte superior
          labels: {
            color: 'rgba(0, 0, 0, 0.7)',  // Color de la leyenda
            font: {
              size: 14,  // Tamaño de la fuente de la leyenda
              family: 'Arial, sans-serif',  // Tipo de fuente de la leyenda
            },
          },
        },
        title: {
          display: true,
          text: 'Cantidad de Casos por Emisor',  // Título de la gráfica
          font: {
            size: 18,  // Tamaño de la fuente del título
            family: 'Arial, sans-serif',  // Tipo de fuente del título
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje X
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje Y
          },
          ticks: {
            font: {
              size: 12,  // Tamaño de la fuente de las etiquetas del eje Y
              family: 'Arial, sans-serif',  // Tipo de fuente de las etiquetas del eje Y
            },
            callback: function (value) {
              return value.toLocaleString();  // Agrega separadores de miles a las etiquetas del eje Y
            },
          },
        },
      },
      animation: {
        duration: 1000,  // Duración de la animación (1 segundo)
        easing: 'easeOutBounce',  // Efecto de rebote al cargar la gráfica
      },
    };

  };



  // Función para generar un color aleatorio (puedes ajustar esta función para generar colores más claros u oscuros)
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Función para formatear datos agrupados por mes para el gráfico de líneas apiladas
  const formatChartData7 = (data) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const casosPorAnioYMes = {};

    // Agrupar los casos por año y mes
    data.forEach(item => {
      const year = item.anio;
      const month = item.mes - 1; // Ajustar el índice para que coincida con el array de meses
      const key = `${year}-${month}`;

      // Inicializar el conteo si la clave no existe en el objeto
      if (!casosPorAnioYMes[key]) {
        casosPorAnioYMes[key] = 0;
      }

      // Sumar los casos de ese mes y año
      casosPorAnioYMes[key] += item.cantidad_casos;
    });

    // Preparar las etiquetas y los datasets para el gráfico
    const labels = months;
    const datasets = [];

    // Obtener los años únicos a partir de los datos
    const years = [...new Set(data.map(item => item.anio))];

    // Inicializar datasets para cada año
    years.forEach(year => {
      const dataForYear = [];
      months.forEach((_, monthIndex) => {
        const key = `${year}-${monthIndex}`;
        dataForYear.push(casosPorAnioYMes[key] || 0);
      });

      // Agregar el dataset para este año con un color aleatorio
      datasets.push({
        label: year.toString(),
        data: dataForYear,
        fill: true,
        backgroundColor: getRandomColor(), // Asignar color aleatorio
        borderColor: getRandomColor(),     // Borde de línea para cada año
        tension: 0.3,                       // Curva de suavizado en las líneas (opcional)
        //maxBarThickness: 50
      });
    });

    // Configuración de datos para el gráfico
    setChartData7({
      labels: labels,
      datasets: datasets,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      // backgroundColor: labels.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`), // Generar colores aleatorios
       borderRadius: 5,  // Bordes redondeados
       //maxBarThickness: 50,  // Ajuste de grosor de barras
     
    });
  };

  const formatChartData8 = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Formato de datos inválido para resFondoVoto:', data);
      return;
    }

    // Extrae las etiquetas y los datos de la respuesta
    const labels = data.map(item => `Fondo Voto ${item.res_fondo_voto}`);
    const counts = data.map(item => item.cantidad_resoluciones);

    // Actualiza el estado de chartData8 con los nuevos datos
    setChartData8({
      labels,  // Etiquetas de la gráfica, que se asignan desde las variables 'labels'
      datasets: [
        {
          label: 'Cantidad de Resoluciones por Fondo Voto',
          data: counts,  // Datos de las resoluciones
          backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Color de las barras con opacidad
          borderColor: 'rgba(75, 192, 192, 1)',  // Color del borde de las barras
          borderWidth: 1,  // Grosor del borde
          borderRadius: 5,  // Bordes redondeados para una apariencia más suave
          maxBarThickness: 50,  // Máximo grosor de las barras para mantener consistencia
        },
      ],
    });

    
    // Opciones adicionales para la gráfica
    const options = {
      responsive: true,  // La gráfica es responsiva, se adapta al tamaño de la pantalla
      maintainAspectRatio: false,  // Mantiene las proporciones de la gráfica al redimensionar
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw + " resoluciones";  // Personalización del texto del tooltip
            },
          },
        },
        legend: {
          position: 'top',  // Coloca la leyenda en la parte superior
          labels: {
            color: 'rgba(0, 0, 0, 0.7)',  // Color de las etiquetas de la leyenda
            font: {
              size: 14,  // Tamaño de la fuente de la leyenda
              family: 'Arial, sans-serif',  // Tipo de fuente de la leyenda
            },
          },
        },
        title: {
          display: true,  // Muestra el título
          text: 'Cantidad de Resoluciones por Fondo Voto',  // Título de la gráfica
          font: {
            size: 18,  // Tamaño de la fuente del título
            family: 'Arial, sans-serif',  // Tipo de fuente del título
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje X
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // Color suave de las líneas del eje Y
          },
          ticks: {
            font: {
              size: 12,  // Tamaño de la fuente de las etiquetas del eje Y
              family: 'Arial, sans-serif',  // Tipo de fuente de las etiquetas del eje Y
            },
            callback: function (value) {
              return value.toLocaleString();  // Formato de números con separadores de miles
            },
          },
        },
      },
      animation: {
        duration: 1000,  // Duración de la animación (1 segundo)
        easing: 'easeOutBounce',  // Efecto de rebote en la animación
      },
    };

  };





  const renderTable = () => {
    if (currentChart === 'chart1') {
      const headers = ['Departamento', 'Cantidad de Casos'];
      return (
        <>
          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData1.labels, chartData1.datasets[0]?.data, 'chart1_data')}
          >
            Descargar Excel
          </button>
          <table className="data-table">
            <thead>
              <tr>
                <th>Departamento</th>
                <th>Cantidad de Casos</th>
              </tr>
            </thead>
            <tbody>
              {chartData1.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData1.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{totalCases}</strong></td>
              </tr>
            </tbody>
          </table>

        </>


      );
    } else if (currentChart === 'chart2') {
      const headers = ['Municipio', 'Cantidad de Casos'];
      const labels = chartData2.labels;
      const data = chartData2.datasets[0]?.data || []; // Asegúrate de que 'data' es un array

      return (
        <>

          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData2.labels, chartData2.datasets[0]?.data, 'chart2_data')}
          >
            Descargar Excel
          </button>
          <table className="data-table">
            <thead>
              <tr>
                <th>Municipio</th>
                <th>Cantidad de Casos</th>
              </tr>
            </thead>
            <tbody>
              {chartData2.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData2.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{chartData2.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </>
      );

    } else if (currentChart === 'chart3') {
      const headers = ['Departamento-Tipo Resolución- Subtipo Resolución', 'Cantidad de Resoluciones'];
      return (
        <>
          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData3.labels, chartData3.datasets[0]?.data, 'chart3_data')}
          >
            Descargar Excel
          </button>


          <table className="data-table">
            <thead>
              <tr>
                <th>Departamento - Tipo Resolución - Subtipo Resolución</th>
                <th>Cantidad de Resoluciones</th>
              </tr>
            </thead>
            <tbody>
              {chartData3.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData3.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{chartData3.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else if (currentChart === 'chart4') {
      const headers = ['Mes', 'Cantidad de Resoluciones'];

      return (
        <>

          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData4.labels, chartData4.datasets[0]?.data, 'chart4_data')}
          >
            Descargar Excel
          </button>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Cantidad de Resoluciones</th>
              </tr>
            </thead>
            <tbody>
              {chartData4.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData4.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{chartData4.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else if (currentChart === 'chart5') {
      const headers = ['Tipo de Acción Constitucional - Subtipo Accion Constitucional  ', 'Cantidad de REsoluciones'];
      return (
        <>
          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData5.labels, chartData5.datasets[0]?.data, 'chart5_data')}
          >
            Descargar Excel
          </button>


          <table className="data-table">
            <thead>
              <tr>
                <th>Acción Constitucional 2 - Acción Constitucional</th>
                <th>Cantidad de Resoluciones</th>
              </tr>
            </thead>
            <tbody>
              {chartData5.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData5.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{chartData5.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else if (currentChart === 'chart6') {
      const headers = ['Emisor de Resolución ', 'Cantidad de Casos'];
      return (
        <>

          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData6.labels, chartData6.datasets, 'chart6_data')}
          >
            Descargar Excel
          </button>


          <table className="data-table">
            <thead>
              <tr>
                <th>Emisor de Resolución</th>
                <th>Cantidad de Casos</th>
              </tr>
            </thead>
            <tbody>
              {chartData6.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  <td>{chartData6.datasets[0]?.data[index] ?? 0}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{chartData6.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) ?? 0}</strong></td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
    else if (currentChart === 'chart7') {
      const headers = ['Año - Mes', ...chartData7.datasets.map(dataset => dataset.label), 'Total'];

      return (
        <>
          <button
            className="download-button"
            onClick={() => downloadExcels(headers, chartData7.labels, chartData7.datasets, 'chart7_data')}
          >
            Descargar Excel
          </button>

          <table className="data-table">
            <thead>
              <tr>
                <th>Año - Mes</th>
                {chartData7.datasets.map(dataset => (
                  <th key={dataset.label}>{dataset.label}</th>
                ))}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {chartData7.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td>
                  {chartData7.datasets.map((dataset) => (
                    <td key={dataset.label}>
                      {dataset.data[index] ?? 0}
                    </td>
                  ))}
                  <td>
                    <strong>
                      {chartData7.datasets.reduce((total, dataset) => total + (dataset.data[index] || 0), 0)}
                    </strong>
                  </td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                {chartData7.datasets.map((dataset) => (
                  <td key={dataset.label}>
                    <strong>
                      {dataset.data.reduce((acc, curr) => acc + curr, 0) ?? 0}
                    </strong>
                  </td>
                ))}
                <td>
                  <strong>
                    {chartData7.datasets.reduce((total, dataset) => total + dataset.data.reduce((acc, curr) => acc + curr, 0), 0)}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }

    else if (currentChart === 'chart8') {
      // Calcular el total de las resoluciones
      const totalResoluciones = chartData8.datasets[0].data.reduce((acc, current) => acc + current, 0);
      const headers = ['Res Fondo Voto', 'Cantidad de Resoluciones'];
      return (
        <>
          <button
            className="download-button"
            onClick={() => downloadExcel(headers, chartData8.labels, chartData8.datasets, 'chart8_data')}
          >
            Descargar Excel
          </button>

          <table className="data-table">
            <thead>
              <tr>
                <th>Res Fondo Voto</th>
                <th>Cantidad de Resoluciones</th>
              </tr>
            </thead>
            <tbody>
              {chartData8.labels.map((label, index) => (
                <tr key={index}>
                  <td>{label}</td> {/* Muestra el fondo de voto */}
                  <td>{chartData8.datasets[0].data[index] ?? 0}</td> {/* Muestra la cantidad de resoluciones */}
                </tr>
              ))}
              {/* Fila para el total */}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{totalResoluciones}</strong></td> {/* Muestra el total de resoluciones */}
              </tr>
            </tbody>
          </table>
        </>
      );
    }



  };
  // En caso de error
  if (error) {
    return <div className="error-message">{error}</div>;
  }

 
  
  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center" role="tab">
          <h3 className="font-weight-bold mb-0"><i className="fa fa-filter"></i> Filtrar Resultado de casos y resoluciones</h3>
          <a href="/Dinamicas" className="btn btn-outline-dark font-weight-bold ml-auto">
            <i className="fa fa-arrow-left"></i> Atrás
          </a>
        </div>
        {currentChart !== 'chart4' && currentChart !== 'chart5'  && currentChart !== 'chart7' && currentChart !== 'chart8' && (
          <select onChange={handleDepartmentChange} value={selectedDepartment} className="select-departamento">
            <option value=''>Todos los departamentos</option>
            {departments.map(department => (
              <option key={department.id} value={department.id}>{department.nombre}</option>
            ))}
          </select>
        )
        }

        {currentChart === 'chart3' && (
          <select id="restipo2" value={selectedRestipo2} onChange={handleRestipo2Change} className="select-departamento">
            <option value=''>Seleccione un tipo de resolución</option>
            {restipo2Options.map((tipo, index) => (
              <option key={tipo.id || index} value={tipo.tipo_resolucion2}>
                {tipo.tipo_resolucion2}
              </option>
            ))}
          </select>)}

        {currentChart === 'chart4' && (
          <>
            <select onChange={handleYearChange} value={selectedYear} className="select-year select-departamento">
              <option value=''>Selecciona un año</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </>)}
        {currentChart === 'chart5' && (
          <select onChange={handleAccionConst2Change} value={selectedAccionConst2} className="select-accion-const2 select-departamento">
            <option value=''>Selecciona Acción Constitucional 2</option>
            {accionConst2Options.map(option => (
              <option key={option.id} value={option.id}>{option.nombre}</option>
            ))}
          </select>)}
        {currentChart === 'chart6' && (
          <select onChange={handleResEmisorChange} value={selectedResEmisor} className="select-resEmisor select-departamento">
            <option value=''>Selecciona Emisor</option>
            {resEmisorOptions.map(option => (
              <option key={option.id} value={option.id}>{option.nombre}</option>
            ))}
          </select>
        )}
        {currentChart === 'chart7' && (
          <select onChange={handleFechaIngresoChange} value={selectedFechaIngreso} className="select-year select-departamento">
            <option value=''>Selecciona un año (fecha ingreso)</option>
            {yearsIngreso.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}

        {currentChart === 'chart8' && (
          <select
            onChange={handleResFondoVotoChange}
            value={selectedResFondoVoto}
            className="select-year select-departamento"
          >
            <option value=''>Selecciona un Res Fondo Voto</option>
            {dataResFondoVoto.map(item => (
              <option key={item.res_fondo_voto} value={item.res_fondo_voto}>
                {item.res_fondo_voto}
              </option>
            ))}
          </select>

        )}



        <div className="view-toggle">
          <button id='GraficoDatos' onClick={() => setViewType('chart')} className={viewType === 'chart' ? 'active' : ''}>Gráfica</button>
          <button id='TablaDatos' onClick={() => setViewType('table')} className={viewType === 'table' ? 'active' : ''}>Tabla</button>
        </div>
        <select onChange={(e) => setChartType(e.target.value)} value={chartType} className="select-grafico">
          <option value='bar'>Gráfico de Barras</option>
          <option value='line'>Gráfico de Líneas</option>
          <option value='pie'>Gráfico Circular</option>
        </select>
        <select onChange={(e) => setCurrentChart(e.target.value)} value={currentChart} className="select-grafico">

          <option value='chart1'>Gráfico por Departamento</option>
          <option value='chart2'>Gráfico por Municipio</option>
          <option value='chart7'>Gráfico Casos por Fecha  (Año-Mes)</option>
          <option value='chart6'>Gráfico por ResEmisor</option>


        </select>
        <select onChange={(e) => setCurrentChart(e.target.value)} value={currentChart} className="select-grafico">
          <option value='chart'>selecione grafico por resoluciones</option>
          <option value='chart3'>Gráfico por Resoluciones</option>
          <option value='chart4'>Gráfico por Fecha (Año-Mes)</option>
          <option value='chart5'>Gráfico por Acción Constitucional</option>
          <option value='chart8'>Gráfico por Fondo Voto</option>
        </select>
        <div className="chart-container">
          {viewType === 'chart' ? (
            <div>
                {currentChart === 'chart1' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                       
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      
                      />
                      <button onClick={handleDownload}>Descargar Gráfico</button>
                    </MuiTooltip>
                   

                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData1} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData1} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData1} />}
                    <p className="chart-description">"Este gráfico presenta la cantidad total de causas reportados por departamento..."</p>

                  </>
                )}


                {currentChart === 'chart2' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    <button onClick={handleDownload}>Descargar Gráfico</button>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData2} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData2} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData2} />}
                    <p className="chart-description">"Gráfico de casos por municipio."</p>


                  </>
                )}
                {currentChart === 'chart3' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData3} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData3} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData3} />}
                    <p className="chart-description">"Cantidad de Resoluciones por Departamento..."</p>
                  </>
                )}
                {currentChart === 'chart4' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData4} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData4} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData4} />}
                    <p className="chart-description">"Cantidad de Resoluciones por Año y Mes..."</p>
                  </>
                )}
                {currentChart === 'chart5' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData5} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData5} />}
                    
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData5} />}
                    <p className="chart-description">"Cantidad de Resoluciones por Acción Constitucional..."</p>
                  </>
                )}
                {currentChart === 'chart6' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData6} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData6} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData6} />}
                    <p className="chart-description">"Cantidad de Casos por ResEmisor..."</p>
                  </>
                )}

                {currentChart === 'chart7' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>
                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData7} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData7} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData7} />}
                    <p className="chart-description">"Cantidad de Casos por Año y mes..."</p>
                  </>
                )}
                {currentChart === 'chart8' && (
                  <>
                    <MuiTooltip title="Guardar como Imagen">
                      <DownloadIcon
                        onClick={handleDownload}
                        style={{ cursor: 'pointer', fontSize: '24px', color: '#1976d2' }}
                      />
                    </MuiTooltip>

                    {chartType === 'bar' && <Bar key={chartKey} ref={chartRef} data={chartData8} />}
                    {chartType === 'line' && <Line key={chartKey} ref={chartRef} data={chartData8} />}
                    {chartType === 'pie' && <Pie key={chartKey} ref={chartRef} data={chartData8} />}
                    <div className="chart-description">
                      <p>Cantidad de Resoluciones por Fondo Voto:</p>
                      <ul>
                        <li>1 = Resolución unánime</li>
                        <li>2 = Resolución con disidencia o voto aclaratorio</li>
                      </ul>
                    </div>
                  </>
                )}
              
            </div>
          ) : (
            renderTable()
          )}
        </div>
      </div>
    </div>
  );
};
export default PaginaFiltro; 