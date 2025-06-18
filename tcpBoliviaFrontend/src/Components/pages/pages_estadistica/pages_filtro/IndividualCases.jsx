import React, { useState, useEffect } from "react";
import axios from "axios";

import ReactECharts from "echarts-for-react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button } from "@mui/material";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import "../../../../Styles/Styles_estadisticas/casosIndividuales.css"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const IndividualCases = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [resEmisores, setResEmisores] = useState([]);
  const [anios, setAnios] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [selectedResEmisor, setSelectedResEmisor] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);

  const [filteredMunicipios, setFilteredMunicipios] = useState([]);

  const [subTiposAcciones, setSubTiposAcciones] = useState([]);
  const [selectedSubTipoAccion, setSelectedSubTipoAccion] = useState("");
  const [allSubTiposAcciones, setAllSubTiposAcciones] = useState([]);
  const [loadingSubTipos, setLoadingSubTipos] = useState(false);

  const [accionesConstitucionales, setAccionesConstitucionales] = useState([]);
  const [selectedAccionConstitucional, setSelectedAccionConstitucional] =
    useState("");

  const [alignment, setAlignment] = useState("bar");
  const [alignmentGraphicOrTable, setAlignmentGraphicOrTable] =
    useState("graphic");

  const [tableData, setTableData] = useState([]);

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  useEffect(() => {
    fetchAniosDisponibles();

    setChartOptions(null);
    setChartData({ labels: [], datasets: [], series: [] });

    switch (filterType) {
      case "Grafico por departamento":
        fetchDepartamentos();
        fetchChartData(selectedDepartment);
        break;
      case "Grafico por municipio":
        fetchDepartamentos();
        fetchMunicipios();
        fetchChartDataMunicipios(selectedMunicipio, selectedDepartment);
        break;
      case "Grafico de casos por fecha":
        fetchChartDataPorFecha(selectedAnio, selectedMes);
        break;
      case "Grafico por res emisor":
        fetchResEmisores();
        fetchChartDataPorResEmisor(selectedResEmisor);
        break;
      case "Grafico por acción constitucional":
        fetchAccionesConstitucionales();
        fetchChartDataAccionConstitucional(selectedAccionConstitucional);
        break;
      case "Grafico por sub tipo de acciones":
        fetchAccionesConstitucionales();
        // Solo ejecutamos fetchChartDataPorSubTipoAccion si los subtipos ya se cargaron
        if (!loadingSubTipos) {
          fetchChartDataPorSubTipoAccion(
            selectedSubTipoAccion,
            selectedAccionConstitucional
          );
        }
        break;
      default:
        break;
    }
  }, [
    filterType,
    selectedDepartment,
    selectedMunicipio,
    selectedAnio,
    selectedMes,
    selectedResEmisor,
    selectedSubTipoAccion,
    selectedAccionConstitucional,
    alignment,
    loadingSubTipos,
  ]);

  //  Actualizar opciones del gráfico cuando cambia `chartData`
  useEffect(() => {
    if (chartData.labels.length > 0) {
      updateChartOptions(alignment);
    }
  }, [chartData, alignment]);

  //  Obtener lista de departamentos
  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/departamentos"
      );
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  //  Obtener lista de municipios
  const fetchMunicipios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/municipios"
      );
      const municipiosData = response.data;

      // Mapear los municipios para incluir el nombre del departamento
      const municipiosConDepartamento = municipiosData.map((mun) => {
        const departamento = departamentos.find(
          (dep) => dep.id === mun.departamento_id
        );
        return {
          ...mun,
          departamento_nombre: departamento
            ? departamento.nombre
            : "Desconocido",
        };
      });

      setMunicipios(municipiosConDepartamento);
      setFilteredMunicipios(municipiosConDepartamento);
    } catch (error) {
      console.error("Error al obtener municipios:", error);
      setMunicipios([]);
      setFilteredMunicipios([]);
    }
  };

  //  Obtener lista de años disponibles
  const fetchAniosDisponibles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-anio"
      );
      const aniosUnicos = [...new Set(response.data.map((item) => item.anio))];
      setAnios(aniosUnicos);
    } catch (error) {
      console.error("Error al obtener años:", error);
    }
  };

  //  Obtener datos por departamento
  const fetchChartData = async (department = "") => {
    setLoading(true);
    try {
      const params = department ? { departamentos_id: department } : {};
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-departamento",
        { params }
      );
      const formattedData = formatChartData(response.data, "departamento");
      setChartData(formattedData);

      const labels = response.data.map((item) => item.departamento);
      const counts = response.data.map((item) => item.cantidad_casos);

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Departamento", alignment)
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setChartOptions(null);
    } finally {
      setLoading(false);
    }
  };

  //  Obtener datos por municipio (solo con casos)
  const fetchChartDataMunicipios = async (
    municipio = "",
    departamento = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (municipio) params.municipios_id = municipio;
      if (departamento) params.departamento_id = departamento;

      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-departamento-municipio",
        { params }
      );

      const normalizedData = response.data.map((item) => ({
        id: item.municipio_id,
        municipio: item.municipio.match(/^Capital \d+$/)
          ? "Capital"
          : item.municipio,
        departamento_id: item.departamento_id,
        departamento_nombre: item.departamento,
        cantidad_casos: item.cantidad_casos,
      }));

      const municipiosConCasos = normalizedData.filter(
        (mun) => mun.cantidad_casos > 0
      );
      setFilteredMunicipios(municipiosConCasos);

      const labels = response.data.map(
        (item) => `${item.municipio} - ${item.departamento}`
      );
      const counts = response.data.map((item) => item.cantidad_casos);

      const formattedData = formatChartData(response.data, "municipio", labels);
      setChartData(formattedData);

      setChartOptions(
        formatChartOptions(
          labels,
          counts,
          "Casos por Municipio y Departamento",
          alignment
        )
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setFilteredMunicipios([]);
      setChartOptions(null);
    } finally {
      setLoading(false);
    }
  };

  //  Obtener datos por fecha
  const fetchChartDataPorFecha = async (anio = "", mes = "") => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;

      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-anio",
        { params }
      );

      if (!response.data || response.data.length === 0) {
        console.log("No se encontraron datos para renderizar el gráfico.");
        setChartData({ labels: [], datasets: [], series: [] });
        setChartOptions(null);
        setTableData([]);
        return;
      }

      // Filtrar los datos devueltos según los valores de anio y mes
      let filteredData = response.data.filter((item) => item.anio !== null);

      if (anio) {
        filteredData = filteredData.filter(
          (item) => item.anio === parseInt(anio)
        );
      }
      if (mes) {
        filteredData = filteredData.filter(
          (item) => item.mes === parseInt(mes)
        );
      }

      console.log("Datos filtrados:", filteredData);

      setTableData(filteredData);

      const uniqueYears = [...new Set(filteredData.map((entry) => entry.anio))];

      console.log("Años únicos:", uniqueYears);

      if (alignment === "pie") {
        const series = uniqueYears.map((year, index) => {
          const yearData = filteredData.filter((entry) => entry.anio === year);
          const data = yearData
            .filter((entry) => entry.cantidad_casos > 0)
            .map((entry) => ({
              name: meses[entry.mes - 1],
              value: entry.cantidad_casos,
            }));

          return {
            name: `Año ${year}`,
            type: "pie",
            radius: [`${index * 20 + 20}%`, `${(index + 1) * 20 + 20}%`],
            data: data.length > 0 ? data : [{ name: "Sin datos", value: 0 }],
            label: {
              show: true,
              position: "outside",
              formatter: "{b}: {c} ({d}%)",
              fontSize: 12,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          };
        });

        console.log("Series para gráfico de tipo 'pie':", series);

        setChartData({ labels: meses, datasets: [], series });
      } else {
        // Filtrar los meses que tienen datos (cantidad_casos > 0)
        const monthsWithData = filteredData
          .filter((entry) => entry.cantidad_casos > 0)
          .map((entry) => entry.mes);

        const uniqueMonths = [...new Set(monthsWithData)].sort((a, b) => a - b);
        const filteredLabels = uniqueMonths.map((month) => meses[month - 1]);

        console.log("Meses con datos:", uniqueMonths);
        console.log("Labels filtrados:", filteredLabels);

        // Generar los datasets para gráficos de tipo "bar" o "line"
        const datasets = uniqueYears.map((year, index) => {
          const yearData = filteredData.filter((entry) => entry.anio === year);
          const dataPorMes = uniqueMonths.map((month) => {
            const entry = yearData.find((e) => e.mes === month);
            return entry ? entry.cantidad_casos : 0;
          });

          return {
            label: `Año ${year}`,
            type: alignment === "bar" ? "bar" : "line",
            stack: alignment === "bar" ? false : undefined,
            data: dataPorMes,
            backgroundColor: getRandomColor(index),
          };
        });

        console.log("Datasets generados para 'bar' o 'line':", datasets);

        setChartData({
          labels: filteredLabels.length > 0 ? filteredLabels : ["Sin datos"],
          datasets: datasets.length > 0 ? datasets : [],
        });
      }
    } catch (error) {
      console.error(" Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [], series: [] });
      setChartOptions(null);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  //  Obtener lista de res emisores
  const fetchResEmisores = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-res-emisor"
      );
      setResEmisores(response.data);
    } catch (error) {
      console.error("Error al obtener res emisores:", error);
    }
  };

  //  Formatear datos para gráficos generales
  const formatChartData = (data, key, customLabels = null) => {
    return {
      labels: customLabels || data.map((item) => item[key]),
      datasets: [
        {
          label: "Cantidad de Casos",
          data: data.map((item) => item.cantidad_casos),
          backgroundColor: data.map((_, index) => getRandomColor(index)), // Colores dinámicos para cada barra
        },
      ],
    };
  };

  //  Obtener datos por res emisor
  const fetchChartDataPorResEmisor = async (resEmisor = "") => {
    try {
      const params = resEmisor ? { res_emisor_id: resEmisor } : {};
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-res-emisor",
        { params }
      );

      const labels = response.data.map(
        (item) =>
          `${item.res_emisor} - ${item.res_emisor_descripcion || "Sin descripción"
          }`
      );
      const counts = response.data.map((item) => item.cantidad_casos);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Casos por Res Emisor",
            data: counts,
            backgroundColor: labels.map((_, index) => getRandomColor(index)),
          },
        ],
      });

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Res Emisor", alignment)
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setChartOptions(null);
    } finally {
      setLoading(false);
    }
  };

  //  Obtener lista de sub tipos de acciones
  const fetchSubTiposAcciones = async (accionConstitucionalId = "") => {
    setLoadingSubTipos(true);
    try {
      if (!accionConstitucionalId) {
        setSubTiposAcciones([]);
        setAllSubTiposAcciones([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/estadisticas/casos/por-subtipo-accion?accion_const_id=${accionConstitucionalId}`
      );

      if (!response.data || !Array.isArray(response.data.data)) {
        console.warn(" No se encontraron subtipos de acciones.");
        setSubTiposAcciones([]);
        setAllSubTiposAcciones([]);
        return;
      }

      const subTipos = response.data.data.map((item) => ({
        nombre: item.sub_tipo_nombre,
        cantidad: item.cantidad_casos,
      }));

      setAllSubTiposAcciones(subTipos);
      setSubTiposAcciones(subTipos);
      console.log(
        "Lista completa de subtipos almacenada en allSubTiposAcciones:",
        subTipos
      );
    } catch (error) {
      console.error("Error al obtener subtipos de acciones:", error);
      setSubTiposAcciones([]);
      setAllSubTiposAcciones([]);
    } finally {
      setLoadingSubTipos(false);
    }
  };

  //  Obtener datos por Subtipo de acción
  const fetchChartDataPorSubTipoAccion = async (
    subTipoAccion = "",
    accionConstitucional = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (subTipoAccion) params.sub_tipo_accion = subTipoAccion;
      if (accionConstitucional) params.accion_const_id = accionConstitucional;

      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-subtipo-accion",
        { params }
      );

      const rawDataArray = response.data.data || [];

      const cleanedDataArray = rawDataArray.map((item) => ({
        ...item,
        sub_tipo_nombre: (item.sub_tipo_nombre ?? '').replace(/[\r\n]+/g, " ").trim(),
      }));


      const labels = cleanedDataArray.map(
        (item) => `${item.accion_const_nombre} - ${item.sub_tipo_nombre}`
      );
      const counts = cleanedDataArray.map((item) => item.cantidad_casos);

      const formattedData = formatChartData(
        cleanedDataArray,
        "sub_tipo_nombre"
      );
      setChartData(formattedData);

      setChartOptions(
        formatChartOptions(
          labels,
          counts,
          "Casos por Subtipo de Acción",
          alignment
        )
      );

      if (allSubTiposAcciones.length > 0) {
        setSubTiposAcciones([...allSubTiposAcciones]);
        console.log(
          "Restableciendo subTiposAcciones después de fetchChartDataPorSubTipoAccion:",
          allSubTiposAcciones
        );
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setChartOptions(null);
      if (allSubTiposAcciones.length > 0) {
        setSubTiposAcciones([...allSubTiposAcciones]);
      }
    } finally {
      setLoading(false);
    }
  };

  //  Obtener lista de acciones constitucionales
  const fetchAccionesConstitucionales = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/acciones-constitucionales"
      );
      setAccionesConstitucionales(response.data);
    } catch (error) {
      console.error("Error al obtener acciones constitucionales:", error);
    }
  };

  //  Obtener datos de "Casos por Acción Constitucional"
  const fetchChartDataAccionConstitucional = async (
    accionConstitucionalId = ""
  ) => {
    setLoading(true);
    try {
      const params = accionConstitucionalId
        ? { accion_const2_id: accionConstitucionalId }
        : {};

      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-accion-constitucional",
        { params }
      );

      const dataArray = response.data.data || [];
      const labels = dataArray.map((item) => item.accion_const_nombre);
      const counts = dataArray.map((item) => item.cantidad_casos);

      const formattedData = formatChartData(dataArray, "accion_const_nombre");
      setChartData(formattedData);

      setChartOptions(
        formatChartOptions(
          labels,
          counts,
          "Casos por Acción Constitucional",
          alignment
        )
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setChartOptions(null);
    } finally {
      setLoading(false);
    }
  };

  const formatChartOptions = (
    labels,
    counts,
    title = "Cantidad de Casos",
    chartType = "bar",
    isFechaChart = false,
    seriesData = null
  ) => {
    // Calcular el total general
    let totalCasos;
    if (isFechaChart && chartType === "pie" && seriesData) {
      totalCasos = seriesData.reduce((acc, serie) => {
        return (
          acc + serie.data.reduce((sum, item) => sum + (item.value || 0), 0)
        );
      }, 0);
    } else if (isFechaChart) {
      totalCasos = tableData.reduce(
        (acc, entry) => acc + (entry.cantidad_casos || 0),
        0
      );
    } else {
      totalCasos = counts.reduce((acc, curr) => acc + (curr || 0), 0);
    }

    console.log("Total casos calculado:", totalCasos);

    // Función auxiliar para truncar labels largos
    const truncateLabel = (label, maxLength = 20) => {
      if (typeof label !== "string") return label;
      return label.length > maxLength
        ? label.substring(0, maxLength - 3) + "..."
        : label;
    };

    // Función auxiliar para dividir labels largos en el tooltip
    const splitLabelForTooltip = (label, maxLengthPerLine = 30) => {
      if (typeof label !== "string") return label;
      // Si el label tiene un separador natural como " - ", lo usamos para dividir
      if (label.includes(" - ")) {
        const parts = label.split(" - ");
        return parts.join("\n");
      }
      // Si no hay separador, dividimos por longitud
      const words = label.split(" ");
      let lines = [];
      let currentLine = "";
      for (let word of words) {
        if ((currentLine + word).length > maxLengthPerLine) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      }
      if (currentLine) lines.push(currentLine.trim());
      return lines.join("\n");
    };

    const options = {
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
        subtextStyle: {
          fontSize: 12,
          color: "#666",
        },
      },
      tooltip: {
        trigger: chartType === "pie" ? "item" : "axis",
        formatter: (params) => {
          if (chartType === "pie") {
            const name = splitLabelForTooltip(params.name);
            return `${params.seriesName}<br/>${name}: ${params.value} (${params.percent}%)`;
          } else {
            const seriesName = params[0].seriesName;
            const axisValue = splitLabelForTooltip(params[0].axisValue);
            const values = params
              .map(
                (item) =>
                  `${item.marker} ${item.seriesName}: ${item.value || 0}`
              )
              .join("<br/>");
            return `${axisValue}<br/>${values}`;
          }
        },
        axisPointer: chartType !== "pie" ? { type: "shadow" } : undefined,
        textStyle: {
          fontSize: 12,
        },
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
        },
      },
      graphic: {
        type: "text",
        left: "center",
        top: "5%",
        style: {
          text: `Total: ${totalCasos}`,
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
    };

    if (chartType === "pie") {
      options.xAxis = undefined;
      options.yAxis = undefined;
      options.dataZoom = undefined;

      if (isFechaChart && seriesData) {
        // Calcular la cantidad de anillos (series)
        const totalSeries = seriesData.length;
        const baseRadius = 15; // radio interior inicial
        const radiusStep = 5; // cuánto crece por cada anillo

        // Crear series tipo pie anidados
        options.series = seriesData.map((serie, index) => {
          const inner = `${baseRadius + index * radiusStep}%`;
          const outer = `${baseRadius + (index + 1) * radiusStep}%`;

          return {
            name: serie.name, // ej: Año
            type: "pie",
            radius: [inner, outer],
            center: ["50%", "60%"],
            label: {
              position: 'outside',
              formatter: (params) => {
                const truncatedName = truncateLabel(params.name, 15);
                return `${truncatedName}: ${params.value}`;
              },
              fontSize: 10,
            },
            labelLine: {
              length: 10,
              length2: 5
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,

              }
            },
            data: serie.data.map((item, i) => ({
              name: item.name,
              value: item.value,
              itemStyle: {
                color: getRandomColor(i)
              }
            }))
          };
        });

        options.legend = {
          type: 'scroll',
          orient: 'horizontal',
          top: '15%',
          data: seriesData.flatMap(s => s.data.map(d => d.name)),
          formatter: (name) => truncateLabel(name, 25),
        };
      }

      else {
        options.series = [
          {
            name: title,
            type: "pie",

            top: "20%",


            data: labels.map((label, index) => ({
              name: label,
              value: counts[index],
              itemStyle: { color: getRandomColor(index) },
            })),
            label: {
              show: true,
              position: "outside",
              formatter: (params) => {
                const truncatedName = truncateLabel(params.name, 15);
                return `${truncatedName}: ${params.value} (${params.percent}%)`;
              },
              fontSize: 12,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ];
        options.legend = {
          top: "15%",

          left: "center",
          orient: "horizontal",
          type: "scroll",
          data: labels,
          formatter: (name) => truncateLabel(name, 25),
        };
      }
    } else {
      options.grid = {
        top: "24%",
        center: ["100%", "100%"],
        containLabel: true,
        // Mantener el margen inferior pequeño para no encoger el gráfico

      };

      options.legend = {
        top: "15%",

        left: "center",
        orient: "horizontal",
        type: "scroll",
        data: isFechaChart ? chartData.datasets.map((d) => d.label) : labels,
        formatter: (name) => truncateLabel(name, 25),
      };

      options.xAxis = {
        type: "category",
        data: labels,
        axisPointer: { type: "shadow" },
        axisLabel: {
          rotate: 45,
          interval: 0,
          fontSize: 10,
          lineHeight: 12,
          formatter: (value) => truncateLabel(value, 33),
          width: 200,
          overflow: "truncate",
          ellipsis: "...",
        },
      };

      options.yAxis = {
        type: "value",
        name: "Cantidad",
        min: 0,
      };

      if (isFechaChart) {
        if (!chartData.datasets || chartData.datasets.length === 0) {
          console.warn("No hay datasets disponibles para generar las series.");
          options.series = [];
        } else {
          options.series = chartData.datasets.map((dataset) => ({
            name: dataset.label,

            type: chartType,
            stack: chartType === "bar" ? false : undefined,
            data: dataset.data,
            itemStyle: { color: dataset.backgroundColor || getRandomColor() },
          }));
        }

        console.log(
          "Series generadas para el gráfico 'bar' o 'line':",
          options.series
        );
      } else {
        options.series = [
          {

            name: title,
            type: chartType,
            data: counts,
            itemStyle: { color: getRandomColor() },
          },
        ];
      }
    }

    return options;
  };


  //  Actualizar configuración del gráfico
  const updateChartOptions = (chartType) => {
    if (chartData.labels.length === 0) return;

    let chartTitle = "Cantidad de Casos";
    let isFechaChart = filterType === "Grafico de casos por fecha";

    setChartOptions(
      formatChartOptions(
        chartData.labels,
        chartData.datasets[0]?.data || [],
        chartTitle,
        chartType,
        isFechaChart,
        chartData.series
      )
    );
  };

  let getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      updateChartOptions(newAlignment);
    }
  };
  const handleChangeGraphicOrTable = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignmentGraphicOrTable(newAlignment);
    }
  };

  const renderTableFecha = () => {
    if (!tableData.length) {
      return (
        <p className="fw-bold fs-5 text-center">No hay datos disponibles</p>
      );
    }

    //  Obtener años únicos dinámicamente
    const years = [...new Set(tableData.map((item) => item.anio))].sort();

    //  Agrupar datos por mes
    const groupedData = meses.map((mes, mesIndex) => {
      const row = { mes };
      let totalMes = 0;

      years.forEach((year) => {
        const dataPoint = tableData.find(
          (item) => item.mes === mesIndex + 1 && item.anio === year
        );

        row[year] = dataPoint ? dataPoint.cantidad_casos : 0;
        totalMes += row[year];
      });

      row.total = totalMes;
      return row;
    });

    //  Calcular totales por año y total general
    const totalRow = { mes: "Total General" };
    let totalGeneral = 0;

    years.forEach((year) => {
      const totalPorAnio = groupedData.reduce(
        (acc, row) => acc + (row[year] || 0),
        0
      );
      totalRow[year] = totalPorAnio;
      totalGeneral += totalPorAnio;
    });

    totalRow.total = totalGeneral;

    return (
      <table className="data-table table table-bordered table-striped">
        <thead>
          <tr>
            <th>Mes</th>
            {years.map((year) => (
              <th key={year}>{year}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.map((row, index) => (
            <tr key={index}>
              <td>{row.mes}</td>
              {years.map((year) => (
                <td key={year}>{row[year]}</td>
              ))}
              <td>
                <strong>{row.total}</strong>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <strong>Total General</strong>
            </td>
            {years.map((year) => (
              <td key={year}>
                <strong>{totalRow[year]}</strong>
              </td>
            ))}
            <td>
              <strong>{totalRow.total}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const exportToExcel = () => {
    let exportData = [];
    let tableHeaders = [];
    let fileName = "Datos_Exportados.xlsx";

    if (filterType === "Grafico de casos por fecha") {
      const years = [...new Set(tableData.map((item) => item.anio))].sort();
      tableHeaders = ["Mes", ...years, "Total"];
      fileName = "Casos_Por_Fecha.xlsx";

      const groupedData = meses.map((mes, mesIndex) => {
        const row = [mes];
        let totalMes = 0;

        years.forEach((year) => {
          const dataPoint = tableData.find(
            (item) => item.mes === mesIndex + 1 && item.anio === year
          );
          const value = dataPoint ? dataPoint.cantidad_casos : 0;
          row.push(value);
          totalMes += value;
        });

        row.push(totalMes);
        return row;
      });

      //  Calcular totales por año y total general correctamente
      const totalRow = ["Total General"];
      let totalGeneral = 0;

      years.forEach((year, yIndex) => {
        const sum = groupedData.reduce((acc, row) => acc + row[yIndex + 1], 0);
        totalRow.push(sum);
        totalGeneral += sum;
      });

      totalRow.push(totalGeneral);

      exportData = [tableHeaders, ...groupedData, totalRow];
    } else {
      //  Exportación genérica para otras tablas
      fileName = `${filterType.replace(/\s+/g, "_")}.xlsx`;

      tableHeaders = ["Descripción", "Cantidad"];
      exportData = [
        tableHeaders,
        ...chartData.labels.map((label, index) => [
          label,
          chartData.datasets[0]?.data[index] || 0,
        ]),
      ];

      // Agregar total general
      exportData.push([
        "Total",
        chartData.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0) || 0,
      ]);
    }

    //  Crear y guardar archivo Excel
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, fileName);
  };

  useEffect(() => {
    if (selectedAccionConstitucional) {
      fetchSubTiposAcciones(selectedAccionConstitucional);
      setSelectedSubTipoAccion("");
    } else {
      setSubTiposAcciones([]);
      setAllSubTiposAcciones([]);
      setSelectedSubTipoAccion("");
    }
  }, [selectedAccionConstitucional]);

  useEffect(() => {
    if (!loadingSubTipos) {
      if (selectedSubTipoAccion === "" && allSubTiposAcciones.length > 0) {
        console.log(
          "Restableciendo subtipos al seleccionar 'Todos los Subtipos de Acciones'"
        );
        setSubTiposAcciones([...allSubTiposAcciones]);
        fetchChartDataPorSubTipoAccion("", selectedAccionConstitucional);
      } else if (selectedSubTipoAccion && allSubTiposAcciones.length > 0) {
        setSubTiposAcciones([...allSubTiposAcciones]);
        fetchChartDataPorSubTipoAccion(
          selectedSubTipoAccion,
          selectedAccionConstitucional
        );
      }
    }
  }, [
    selectedSubTipoAccion,
    allSubTiposAcciones,
    selectedAccionConstitucional,
    loadingSubTipos,
  ]);

  let dynamicHeight = 500;

  return (
    <div
      className="d-flex flex-row mt-2"

      style={{ height: "100%", width: "100%" }}
    >
      {showFilters && (
        <>
      {/* Contenedor de Filtros (Colapsable) */}
      <div  className="bg-light p-4 shadow-sm filtros-container"
        style={{
          width: "500px",  
          width: showFilters ? "520px" : "0",
          borderRight: "2px solid #ddd",
          transition: "width 0.3s ease",
         
          
        }}
      >
        
          
            <Box className="toggle-container" display="flex" flexDirection="column" gap={1}>
              {alignmentGraphicOrTable === "graphic" && (
                <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="graphic"
                >
                  <ToggleButton value="bar">Barras</ToggleButton>
                  <ToggleButton value="pie">Circular</ToggleButton>
                  <ToggleButton value="line">Líneas</ToggleButton>
                </ToggleButtonGroup>
              )}

              <ToggleButtonGroup
                color="primary"
                value={alignmentGraphicOrTable}
                exclusive
                onChange={handleChangeGraphicOrTable}
                aria-label="type"
              >
                <ToggleButton value="graphic">Gráfico</ToggleButton>
                <ToggleButton value="table">Tabla</ToggleButton>
              </ToggleButtonGroup>
            </Box>


            <h2 className="fw-bold text-left mt-2">Filtrar Datos</h2>

            <Box>
              <FormControl fullWidth className="mt-2">
                <InputLabel>Tipo de Gráfico</InputLabel>
                <Select
                  label="Seleccione una opción"
                  onChange={(e) => setFilterType(e.target.value)}
                  value={filterType}
                >
                  <MenuItem value={"Grafico por departamento"}>Gráfico por Departamento</MenuItem>
                  <MenuItem value={"Grafico por municipio"}>Gráfico por Municipio</MenuItem>
                  <MenuItem value={"Grafico de casos por fecha"}>Gráfico de Casos por Fecha</MenuItem>
                  <MenuItem value={"Grafico por res emisor"}>Gráfico por Res Emisor</MenuItem>
                  <MenuItem value={"Grafico por acción constitucional"}>Gráfico por Acción Constitucional</MenuItem>
                  <MenuItem value={"Grafico por sub tipo de acciones"}>Gráfico por Subtipo de Acciones</MenuItem>
                </Select>
              </FormControl>

              {/* Selects condicionales */}
              {filterType === "Grafico por departamento" && (
                <FormControl fullWidth className="mt-3">
                  <InputLabel>Departamento</InputLabel>
                  <Select
                    id="departamento"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {departamentos.map((d) => (
                      <MenuItem key={d.id} value={d.id}>{d.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {filterType === "Grafico por municipio" && (
                <>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Departamento</InputLabel>
                    <Select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <MenuItem value="">Todos los Departamentos</MenuItem>
                      {departamentos.map((dep) => (
                        <MenuItem key={dep.id} value={dep.id}>{dep.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Municipio</InputLabel>
                    <Select
                      value={selectedMunicipio}
                      onChange={(e) => setSelectedMunicipio(e.target.value)}
                      disabled={filteredMunicipios.length === 0}
                    >
                      <MenuItem value="">Todos los Municipios</MenuItem>
                      {filteredMunicipios.length > 0 ? (
                        filteredMunicipios.map((mun) => (
                          <MenuItem key={String(mun.id)} value={String(mun.id)}>
                            {`${mun.municipio} - ${mun.departamento_nombre}`}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Cargando municipios...</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </>
              )}

              {filterType === "Grafico de casos por fecha" && (
                <>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Año</InputLabel>
                    <Select
                      value={selectedAnio}
                      onChange={(e) => setSelectedAnio(e.target.value)}
                    >
                      <MenuItem value="">Seleccionar año</MenuItem>
                      {anios.map((a) => (
                        <MenuItem key={a} value={a}>{a}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Mes</InputLabel>
                    <Select
                      value={selectedMes}
                      onChange={(e) => setSelectedMes(e.target.value)}
                    >
                      <MenuItem value="">Seleccionar mes</MenuItem>
                      {[...Array(12).keys()].map((m) => (
                        <MenuItem key={m} value={m + 1}>{meses[m]}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {filterType === "Grafico por res emisor" && (
                <FormControl fullWidth className="mt-3">
                  <InputLabel>Seleccionar Res Emisor</InputLabel>
                  <Select
                    value={selectedResEmisor}
                    onChange={(e) => setSelectedResEmisor(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {resEmisores.map((res) => (
                      <MenuItem key={res.res_emisor_id} value={res.res_emisor_id}>
                        {res.res_emisor} - {res.res_emisor_descripcion}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {filterType === "Grafico por acción constitucional" && (
                <FormControl fullWidth className="mt-3">
                  <InputLabel>Acción Constitucional</InputLabel>
                  <Select
                    value={selectedAccionConstitucional}
                    onChange={(e) => setSelectedAccionConstitucional(e.target.value)}
                  >
                    <MenuItem value="">Todas las Acciones Constitucionales</MenuItem>
                    {accionesConstitucionales.map((accion) => (
                      <MenuItem key={accion.id} value={accion.id}>{accion.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {filterType === "Grafico por sub tipo de acciones" && (
                <>
                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Acción Constitucional</InputLabel>
                    <Select
                      value={selectedAccionConstitucional}
                      onChange={(e) => setSelectedAccionConstitucional(e.target.value)}
                    >
                      <MenuItem value="">Todas las Acciones Constitucionales</MenuItem>
                      {accionesConstitucionales.map((accion) => (
                        <MenuItem key={accion.id} value={accion.id}>{accion.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth className="mt-3">
                    <InputLabel>Seleccionar Subtipo de Acción</InputLabel>
                    <Select
                      value={selectedSubTipoAccion}
                      onChange={(e) => setSelectedSubTipoAccion(e.target.value)}
                    >
                      <MenuItem value="">Todos los Subtipos</MenuItem>
                      {loadingSubTipos ? (
                        <MenuItem disabled>Cargando subtipos...</MenuItem>
                      ) : subTiposAcciones.length > 0 ? (
                        subTiposAcciones.map((subtipo) => (
                          <MenuItem key={subtipo.nombre} value={subtipo.nombre}>
                            {subtipo.nombre} ({subtipo.cantidad})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>
                          {selectedAccionConstitucional
                            ? "No hay subtipos disponibles"
                            : "Seleccione una acción constitucional"}
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </>
              )}
            </Box>
          
        



      </div>
      </>
)}
      {/* Contenedor de gráfico o tabla */}
      <div
        className="d-flex flex-column justify-content-start align-items-center p-4 grafico-container"
        style={{
          flexGrow: 1,
          position: "relative",
          minWidth: 0,
          width: "100%",
        }}
      >
        {/* Botón tipo MSN para expandir/contraer filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="chevron-toggle-btn"
          title={showFilters ? "Contraer filtros" : "Expandir filtros"}

        >
          <img
            src="https://assets.msn.com/staticsb/statics/latest/finance/icon/light/cheveron_down.svg"
            alt="Chevron"
            style={{
              transform: showFilters ? "rotate(90deg)" : "rotate(-90deg)",
              width: "12px",
              height: "12px",
            }}
          />
        </button>

        {alignmentGraphicOrTable === "graphic" ? (
          <div style={{ width: "100%", maxWidth: "100%" }}>
            {chartOptions && chartData.labels.length > 0 ? (
              <ReactECharts
                option={chartOptions}
                style={{
                  width: "100%",
                  height: `${dynamicHeight}px`,
                }}
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center text-center"
                style={{ width: "100%", height: "400px" }}
              >
                <p className="fw-bold fs-5" style={{ width: "100%" }}>
                  Seleccione un filtro para ver el gráfico
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="table-responsive" style={{ width: "100%", maxWidth: "100%" }}>
            {(tableData.length > 0 || chartData.labels.length > 0) && (
              <div className="d-flex justify-content-end mb-2">
                <Button variant="contained" onClick={exportToExcel}>
                  Descargar Excel
                </Button>
              </div>
            )}

            {filterType === "Grafico de casos por fecha" ? (
              renderTableFecha()
            ) : (
              <table className="data-table table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.labels.map((label, index) => (
                    <tr key={index}>
                      <td>{label}</td>
                      <td>{chartData.datasets[0]?.data[index]}</td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Total</strong></td>
                    <td>
                      <strong>
                        {chartData.datasets[0]?.data.reduce((acc, curr) => acc + curr, 0)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

    </div>

  );
};

export default IndividualCases;