import React, { useState, useEffect } from "react";

import axios from "axios";
import ReactECharts from "echarts-for-react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import { Button } from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MultipleSelection = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [alignment, setAlignment] = useState("bar");
  const [alignmentGraphicOrTable, setAlignmentGraphicOrTable] =
    useState("graphic");

  const [casesOrResolutions, setCasesOrResolutions] = useState("cases");
  const [chartOptions, setChartOptions] = useState(null);


  const [selectedFiltersCases, setSelectedFiltersCases] = useState([]);
  const [selectedFiltersResolutions, setSelectedFiltersResolutions] = useState(
    []
  );

  const [availableSubFilters, setAvailableSubFilters] = useState([]); // Lista de valores únicos
  const [selectedSubFilters, setSelectedSubFilters] = useState([]); // Valores seleccionados por el usuario

  const handleChangeChartType = (event, newChartType) => {
    if (newChartType !== null) {
      setAlignment(newChartType);
    }
  };

  const handleChangeGraphicOrTable = (event, newAlignment) => {
    if (newAlignment !== null) setAlignmentGraphicOrTable(newAlignment);
  };

  const handleChangeCasesOrResolutions = (event, newAlignment) => {
    if (newAlignment !== null) {
      setCasesOrResolutions(newAlignment);

      //  Resetear filtros al cambiar de tipo de datos
      setSelectedFiltersCases([]);
      setSelectedFiltersResolutions([]);
      setSelectedSubFilters([]);
      setAvailableSubFilters([]);
      setChartOptions(null);
    }
  };

  const handleCheckboxChangeCases = (event) => {
    const { name, checked } = event.target;
    setSelectedFiltersCases((prev) =>
      checked ? [...prev, name] : prev.filter((filter) => filter !== name)
    );
  };

  const handleCheckboxChangeResolutions = (event) => {
    const { name, checked } = event.target;
    setSelectedFiltersResolutions((prev) => {
      let updated = checked
        ? [...prev, name]
        : prev.filter((filter) => filter !== name);

      // Limitar a máximo 2
      if (updated.length > 2) updated = updated.slice(-2);
      return updated;
    });

    //  Reiniciar subfiltros y gráfico
    setAvailableSubFilters([]);
    setSelectedSubFilters([]);
    setChartOptions(null);
  };

  const fetchEstadisticasCasos = async () => {
    try {
      if (selectedFiltersCases.length !== 2) {
        setAvailableSubFilters([]);
        setSelectedSubFilters([]);
        setChartOptions(null);
        return;
      }

      const params = {};
      selectedFiltersCases.forEach((filter) => {
        let key = filter.toLowerCase().replace(/ /g, "_");
        params[key] = true;
      });

      setChartOptions(null);

      const response = await axios.get(
        "http://localhost:8000/api/multiples/casos/estadisticas",
        { params }
      );

      if (
        !response.data ||
        !Array.isArray(response.data.data) ||
        response.data.data.length === 0
      ) {
        console.warn(" La API no devolvió datos válidos.");
        setChartOptions(null);
        return;
      }

      const data = response.data.data;
      const [mainCategoryKey, legendCategoryKey] = selectedFiltersCases.map(
        (f) => f.toLowerCase().replace(/ /g, "_")
      );

      if (!mainCategoryKey || !legendCategoryKey) {
        console.error(" No se encontraron categorías válidas en los datos.");
        setChartOptions(null);
        return;
      }

      const isMainFecha = mainCategoryKey === "fecha_ingreso";
      const isLegendFecha = legendCategoryKey === "fecha_ingreso";
      const isMainMunicipio = mainCategoryKey === "municipio";
      const isLegendMunicipio = legendCategoryKey === "municipio";

      // Generar etiquetas combinadas "Municipio - Departamento" si el filtro es "municipio"
      const getCombinedLabel = (item, key) => {
        if (key === "municipio") {
          return `${item.municipio} - ${item.departamento_nombre || "Desconocido"
            }`;
        }
        return item[key] || "Sin datos";
      };

      const uniqueMainCategoryValues = [
        ...new Set(
          isMainFecha
            ? data.map((item) => item.anio?.toString() || "Sin año")
            : data.map((item) => getCombinedLabel(item, mainCategoryKey))
        ),
      ];

      if (
        JSON.stringify(availableSubFilters) !==
        JSON.stringify(uniqueMainCategoryValues)
      ) {
        setAvailableSubFilters(uniqueMainCategoryValues);
        setSelectedSubFilters(uniqueMainCategoryValues);
      }

      const filteredData =
        selectedSubFilters.length > 0
          ? data.filter((item) => {
            const valueToCheck = isMainFecha
              ? item.anio?.toString() || "Sin año"
              : getCombinedLabel(item, mainCategoryKey); // Usar getCombinedLabel para el filtrado
            return selectedSubFilters.includes(valueToCheck);
          })
          : data;

      if (filteredData.length === 0) {
        console.warn(" No hay datos disponibles después del filtrado.");
        setChartOptions(null);
        return;
      }

      const categoriesSet = new Set();
      const seriesDataMap = new Map();

      filteredData.forEach((item) => {
        const anio = item.anio?.toString() || "Sin año";

        // Usar getCombinedLabel para generar las etiquetas del eje X y las series
        const mainValue = getCombinedLabel(item, mainCategoryKey);
        const legendValue = getCombinedLabel(item, legendCategoryKey);
        const count = item.total || 0;

        let x = mainValue;
        let serieKey = legendValue;

        // Ajuste si alguno de los filtros es fecha_ingreso
        if (isMainFecha) {
          x = anio;
          serieKey = legendValue;
        } else if (isLegendFecha) {
          x = mainValue;
          serieKey = anio;
        }

        categoriesSet.add(x);

        if (!seriesDataMap.has(serieKey)) {
          seriesDataMap.set(serieKey, new Map());
        }
        const serie = seriesDataMap.get(serieKey);
        serie.set(x, (serie.get(x) || 0) + count);
      });

      const categories = Array.from(categoriesSet);

      let seriesArray = [];

      if (alignment === "pie") {
        //  Para circular, una sola serie con data en formato { name, value }
        const pieData = [];

         seriesDataMap.forEach((valuesMap, serieKey) => {
          valuesMap.forEach((value, name) => {
            pieData.push({
              name: `${serieKey} (${name})`, // Combina leyenda con categoría
  
              value,
            });
          });
        });

        seriesArray = [
          {
            name: "Cantidad de Causas",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "50%"],
            data: pieData,
            label: {
              show: true,
              position: "outside",
              formatter: (params) =>
                `${params.name} - ${params.value} casos (${params.percent}%)`,
            },
            labelLine: { show: true, length: 20, length2: 10 },
          },
        ];
      } else {
        //  Para barras o líneas
        seriesArray = Array.from(seriesDataMap.keys()).map((serieKey) => ({
          name: serieKey,
          type: alignment,
          stack: "total",
          data: categories.map(
            (category) => seriesDataMap.get(serieKey).get(category) || 0
          ),
          itemStyle: { color: getRandomColor() },
        }));
      }

      if (seriesArray.length === 0) {
        console.warn(" No hay datos suficientes para generar el gráfico.");
        setChartOptions(null);
        return;
      }

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
        if (label.includes(" - ")) {
          const parts = label.split(" - ");
          return parts.join("\n");
        }
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

      const totalCasos = seriesArray.reduce((sum, serie) => {
        if (serie.type === "pie") {
          return sum + serie.data.reduce((acc, item) => acc + item.value, 0);
        }
        return sum + serie.data.reduce((acc, val) => acc + val, 0);
      }, 0);

      const chartOptions = {
        title: {
          text: "Cantidad de Causas",
          left: "center",
          top: "0",
          textStyle: { fontSize: 18, fontWeight: "bold" },
          subtext: `Total de Causas: ${totalCasos}`,
          subtextStyle: { fontSize: 14, color: "#666" },
        },
        tooltip: {
          trigger: alignment === "pie" ? "item" : "axis",
          formatter: (params) => {
            if (alignment === "pie") {
              const name = splitLabelForTooltip(params.name);
              return `${params.seriesName}<br/>${name}: ${params.value} (${params.percent}%)`;
            } else {
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
          axisPointer: { type: "shadow" },
          textStyle: {
            fontSize: 12,
          },
        },
        legend: {
          show: true,
          type: "scroll",
          orient: "horizontal",
          top: 60,
          left: "center",
          textStyle: {
            fontSize: 12,
            width: 160,
            overflow: "truncate",
            ellipsis: "...",
          },
          itemWidth: 12,
          itemGap: 25,
          data:
            alignment === "pie"
              ? seriesArray[0].data.map((d) => d.name)
              : seriesArray.map((s) => s.name),
          formatter: (name) => truncateLabel(name, 25),



        },
        grid:
          alignment === "pie"
            ? undefined
            : {
              top: 100,
              left: "5%",
              right: "15%",
              bottom: "10%",
              containLabel: true,
            },
        xAxis:
          alignment === "pie"
            ? undefined
            : {
              type: "category",
              data: categories,
              axisLabel: {
                rotate: 45,
                interval: 0,
                fontSize: 10,
                lineHeight: 14,
                formatter: (value) => truncateLabel(value, 33),
                width: 200,
                overflow: "truncate",
                ellipsis: "...",
              },
            },
        yAxis: alignment === "pie" ? undefined : { type: "value" },
        series: seriesArray,
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              title: "Descargar",
              name: "grafico_casos",
              type: "png",
              pixelRatio: 2,
            },
          },
          top: 10,
          left: 10,
        },
      };

      setChartOptions(chartOptions);
    } catch (error) {
      console.error(" Error al obtener estadísticas (Casos):", error);
      setChartOptions(null);
    }
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getVisualValue = (key, item) => {
    const realKey = fieldMap[key] || key.toLowerCase().replace(/ /g, "_");
    const descKey = `${realKey}_desc`;
    return item[descKey] ?? item[realKey] ?? "Sin datos";
  };

  const fieldMap = {
    res_tipo_id: "tipo_resolucion",
    res_tipo2_: "tipo_resolucion_2",
    res_fondo_voto: "res_fondo_voto",
    res_resul: "resresul",
    resfinal: "resfinal",
    revresul: "revresul",
    res_fecha: "res_fecha",
    departamento: "departamento",
    relator: "relator",
    restiempo: "restiempo",
    accion_constitucional: "accion_constitucional",
    subtipo_accion_constitucional: "subtipo_accion_constitucional",
  };

  const fetchEstadisticasResoluciones = async () => {
    try {
      if (selectedFiltersResolutions.length !== 2) {
        setAvailableSubFilters([]);
        setSelectedSubFilters([]);
        setChartOptions(null);
        return;
      }

      // Reiniciar chartOptions antes de generar nuevos datos
      setChartOptions(null);

      const params = {};
      selectedFiltersResolutions.forEach((f) => {
        params[f] = true;
      });

      const response = await axios.get(
        "http://localhost:8000/api/multiples/resoluciones/estadisticas",
        { params }
      );

      const data = response.data.data;

      const [filter1, filter2] = selectedFiltersResolutions;

      const mainKey =
        fieldMap[filter1] || filter1.toLowerCase().replace(/ /g, "_");
      const legendKey =
        fieldMap[filter2] || filter2.toLowerCase().replace(/ /g, "_");

      // Subfiltros (eje X)
      if (availableSubFilters.length === 0) {
        const unique = [
          ...new Set(data.map((item) => getVisualValue(filter1, item))),
        ];
        setAvailableSubFilters(unique);
        setSelectedSubFilters(unique);
      }

      const filteredData = selectedSubFilters.length
        ? data.filter((item) =>
          selectedSubFilters.includes(getVisualValue(filter1, item))
        )
        : data;

      if (filteredData.length === 0) {
        setChartOptions(null);
        return;
      }

      // Agrupar datos para el gráfico
      const categoriesSet = new Set();
      const seriesMap = new Map();

      filteredData.forEach((item) => {
        const x = getVisualValue(filter1, item); // Categoría principal (eje X)
        const legend = getVisualValue(filter2, item); // Leyenda
        const count = item.cantidad_resoluciones || 0;

        if (!x || !legend) return;

        categoriesSet.add(x);

        // Agrupar por leyenda (legend) y categoría (x)
        if (!seriesMap.has(legend)) {
          seriesMap.set(legend, new Map());
        }
        const categoryMap = seriesMap.get(legend);
        categoryMap.set(x, (categoryMap.get(x) || 0) + count);
      });

      const categories = Array.from(categoriesSet);

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
        if (label.includes(" - ")) {
          const parts = label.split(" - ");
          return parts.join("\n");
        }
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

      let series = [];

      if (alignment === "pie") {
        // Para gráfico circular: Crear una sola serie con datos en formato { name, value }
        const pieData = [];

        // Iterar sobre cada combinación de leyenda y categoría
        seriesMap.forEach((categoryMap, legend) => {
          categoryMap.forEach((value, category) => {
            if (value > 0) {
              // Solo incluir valores mayores a 0
              pieData.push({
                name: `${legend} (${category})`, // Combinar leyenda y categoría para el nombre
                value: value,
                itemStyle: { color: getRandomColor() },
              });
            }
          });
        });


        if (pieData.length === 0) {
          setChartOptions(null);
          return;
        }


        series = [
          {
            name: "Cantidad de Resoluciones",
            type: "pie",
            radius: selectedFiltersResolutions.includes("restiempo")
              ? ["30%", "70%"] // Reducir el tamaño del círculo para restiempo
              : ["40%", "70%"],
            center: [
              "50%", // Centro en el eje X
              selectedFiltersResolutions.includes("restiempo") ? "40%" : "50%", // Bajar más el círculo si es restiempo
            ],
            data: pieData,
            label: {
              show: true,
              fontSize: 10,
              position: "outside",
              formatter: (params) =>
                `${params.name}: ${params.value} (${params.percent}%)`,

            },
            labelLine: { show: true, length: 10, length2: 10 },
          },
        ];
      } else {
        series = Array.from(seriesMap.entries()).map(([legend, values]) => ({
          name: legend,
          type: alignment,
          stack: "total",
          data: categories.map((cat) => values.get(cat) || 0),
          itemStyle: { color: getRandomColor() },
        }));
      }

      if (categories.length === 0 || series.length === 0) {
        setChartOptions(null);
        return;
      }

      const total = series.reduce((sum, s) => {
        if (s.type === "pie") {
          return sum + s.data.reduce((acc, item) => acc + item.value, 0);
        }
        return sum + s.data.reduce((acc, val) => acc + val, 0);
      }, 0);

      let dynamicRotate = 45;

      if (selectedFiltersResolutions[0] === "res_tipo_id") {
        dynamicRotate = 90;
      }

      const chartOptions = {
        title: {
          text: "Cantidad de Resoluciones",
          left: "center",
          top: "0",
          textStyle: { fontSize: 18, fontWeight: "bold" },
          subtext: `Total: ${total}`,
          subtextStyle: { fontSize: 14, color: "#666" },
        },
        tooltip: {
          trigger: alignment === "pie" ? "item" : "axis",
          formatter: (params) => {
            if (alignment === "pie") {
              const name = splitLabelForTooltip(params.name);
              return `${params.seriesName}<br/>${name}: ${params.value} (${params.percent}%)`;
            } else {
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
          axisPointer: { type: "shadow" },
          textStyle: {
            fontSize: 12,
          },
        },
        legend: {
          show: true,
          type: "scroll",
          orient: alignment === "pie" ? "horizontal" : "horizontal",
          top: alignment === "pie" ? 60 : 50,
          left: alignment === "pie" ? "center" : "center",
          textStyle: {
            fontSize: 12,
            width: 160,
            overflow: "truncate",
            ellipsis: "...",
          },
          itemWidth: 12,
          itemGap: 15,
          data:
            alignment === "pie"
              ? series[0].data.map((d) => d.name)
              : series.map((s) => s.name),
          formatter: (name) => truncateLabel(name, 25),
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              title: "Descargar",
              name: "grafico_resoluciones",
              type: "png",
              pixelRatio: 2,
            },
          },
          top: 10,
          right: 10,
        },
        grid:
          alignment === "pie"
            ? undefined
            : {
              top: 100,
              left: "5%",
              right: "15%",
              bottom: "10%",
              containLabel: true,
            },
        xAxis:
          alignment === "pie"
            ? undefined
            : {
              type: "category",
              data: categories,
              axisLabel: {
                rotate: dynamicRotate,
                interval: 0,
                fontSize: 10,
                lineHeight: 12,
                formatter: (value) => truncateLabel(value, 33),
                width: 200,
                overflow: "truncate",
                ellipsis: "...",
              },
            },
        yAxis: alignment === "pie" ? undefined : { type: "value" },
        series,
      };

      setChartOptions(chartOptions);
    } catch (error) {
      console.error(" Error al obtener estadísticas:", error);
      setChartOptions(null);
    }
  };

  useEffect(() => {
    if (
      casesOrResolutions === "resolutions" &&
      selectedFiltersResolutions.length === 2
    ) {
      fetchEstadisticasResoluciones();
    }
  }, [selectedFiltersResolutions, casesOrResolutions, alignment]);

  useEffect(() => {
    if (
      selectedSubFilters.length > 0 &&
      selectedFiltersResolutions.length === 2 &&
      casesOrResolutions === "resolutions"
    ) {
      fetchEstadisticasResoluciones();
    }
  }, [selectedSubFilters]);

  useEffect(() => {
    if (casesOrResolutions === "cases" && selectedFiltersCases.length > 0) {
      fetchEstadisticasCasos();
    }
  }, [selectedFiltersCases, casesOrResolutions, selectedSubFilters, alignment]);

  useEffect(() => {
    if (
      chartOptions &&
      Object.keys(chartOptions).length > 0 &&
      Array.isArray(chartOptions.series)
    ) {
      updateChartOptions();
    }
  }, [alignment]);

  const updateChartOptions = () => {
    if (!chartOptions || !Array.isArray(chartOptions.series)) return;

    setChartOptions((prevOptions) => {
      if (!prevOptions || !Array.isArray(prevOptions.series))
        return prevOptions;

      return {
        ...prevOptions,
        series: prevOptions.series.map((serie) => ({
          ...serie,
          type: alignment,
          stack: alignment === "pie" ? null : "total",
          radius: alignment === "pie" ? ["40%", "70%"] : undefined,
          label:
            alignment === "pie"
              ? {
                show: true,
                position: "outside",
                fontSize: 12,
                color: "#000",
                formatter: (params) => {
                  console.log("Datos del sector del gráfico:", params);

                  // Usar el nombre correcto en la leyenda (si está vacío, usar seriesName)
                  const categoryName =
                    params.name && params.name.trim() !== ""
                      ? params.name
                      : params.seriesName;

                  return `${categoryName} - ${params.value} casos (${params.percent}%)`;
                },
              }
              : { show: true },
          labelLine:
            alignment === "pie"
              ? { show: true, length: 20, length2: 10 }
              : undefined,
        })),
        tooltip: {
          trigger: alignment === "pie" ? "item" : "axis",
          formatter: function (params) {
            console.log("Datos del tooltip:", params);

            if (alignment === "pie") {
              // Si params.name está vacío, usamos params.seriesName
              const categoryName =
                params.name && params.name.trim() !== ""
                  ? params.name
                  : params.seriesName;

              return `<b>${categoryName}</b>: ${params.value} casos (${params.percent}%)`;
            }

            const categoria = params[0].axisValue;
            const subcategoryValues = params
              .filter((p) => p.data !== 0)
              .map((p) => `<b>${p.seriesName}</b>: ${p.data}`)
              .join("<br/>");

            return `<b>${categoria}</b><br/>${subcategoryValues}`;
          },
        },
        legend: {
          show: true,
          type: "scroll",
          right: "5%",
          top: "middle",
          orient: "vertical",
          textStyle: { fontSize: 12 },
          formatter: (name) =>
            name.length > 15 ? `${name.substring(0, 15)}...` : name,
        },
        xAxis: alignment === "pie" ? undefined : prevOptions.xAxis,
        yAxis: alignment === "pie" ? undefined : prevOptions.yAxis,
      };
    });
  };




  const exportToExcel = () => {
    if (!chartOptions || !chartOptions.series) return;

    const categorias = chartOptions?.xAxis?.data || [];
    const series = chartOptions?.series || [];

    // Inicializar estructura de datos: { categoria: { serieName: value } }
    const pivotData = {};
    const columnas = new Set();

    series.forEach((serie) => {
      serie.data.forEach((value, i) => {
        const categoria = categorias[i] || "—";
        if (!pivotData[categoria]) pivotData[categoria] = {};
        pivotData[categoria][serie.name] = value;
        columnas.add(serie.name);
      });
    });

    const columnasArray = Array.from(columnas);
    columnasArray.sort(); // Opcional: ordenar alfabéticamente

    // Crear encabezado: primera columna + columnas de series + Total
    const headers = [
      casesOrResolutions === "cases"
        ? selectedFiltersCases[0] || "Categoría"
        : selectedFiltersResolutions[0] || "Categoría",
      ...columnasArray,
      "Total",
    ];

    const exportData = [headers];

    // Cuerpo de tabla
    for (const categoria in pivotData) {
      const row = [categoria];
      let rowTotal = 0;

      columnasArray.forEach((serieName) => {
        const val = pivotData[categoria][serieName] || 0;
        row.push(val);
        rowTotal += val;
      });

      row.push(rowTotal);
      exportData.push(row);
    }

    // Fila Total final (por columna)
    const totalRow = ["Total"];
    let grandTotal = 0;

    columnasArray.forEach((serieName) => {
      const totalPorSerie = series.find((s) => s.name === serieName)?.data.reduce((a, b) => a + b, 0) || 0;
      totalRow.push(totalPorSerie);
      grandTotal += totalPorSerie;
    });

    totalRow.push(grandTotal);
    exportData.push(totalRow);

    // Crear hoja Excel
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pivot");

    // Crear nombre de archivo
    const filtro1 =
      (casesOrResolutions === "cases"
        ? selectedFiltersCases[0]
        : selectedFiltersResolutions[0]) || "filtro1";
    const filtro2 =
      (casesOrResolutions === "cases"
        ? selectedFiltersCases[1]
        : selectedFiltersResolutions[1]) || "filtro2";
    const fecha = new Date().toISOString().slice(0, 10);

    const fileName = `tabla_${casesOrResolutions}_${filtro1}_${filtro2}_${fecha}.xlsx`
      .replace(/\s+/g, "_")
      .toLowerCase();

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, fileName);
  };



  let dynamicHeight = 600; // Valor por defecto

  // Establecer altura base según el tipo de gráfico
  if (alignment === "pie") {
    dynamicHeight = 800;
  }

  if (selectedFiltersResolutions.includes("restiempo") && alignment === "pie") {
    dynamicHeight = 2000;
    
  }

  return (
    <div
      className="d-flex flex-md-row flex-column mt-2"
      style={{ height: "100%" }}
    >
      {/* Contenedor de Filtros */}


      {showFilters && (
        <div
          className="bg-light p-4 shadow-sm filtros-container"
          style={{
            width: "500px",
            maxWidth: "720px",
            borderRight: "2px solid #ddd",
          }}
        >
          <Box className="toggle-container" display="flex" flexDirection="column" gap={1}>
            {alignmentGraphicOrTable === "graphic" && (
              <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChangeChartType}
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
              className="second-toggle mt-2 ml-0"
            >
              <ToggleButton value="graphic">Gráfico</ToggleButton>
              <ToggleButton value="table">Tabla</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box>
            <ToggleButtonGroup
              color="primary"
              value={casesOrResolutions}
              exclusive
              onChange={handleChangeCasesOrResolutions}
              aria-label="type"
              className="second-toggle mt-2 ml-0"
            >
              <ToggleButton value="cases">Causas</ToggleButton>
              <ToggleButton value="resolutions">Resoluciones</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <div
            className="container_filter"
            style={{
              display: "flex", // Agregado para organizar en columnas
              gap: "20px",
              maxHeight: "50vh",
              overflowY: "auto",
            }}
          >
            {/* filtros aqui */}
            <div className="filters">
              <h2 className="fw-bold text-left mt-2">Filtrar Datos</h2>
              <FormGroup>
                {casesOrResolutions === "cases" && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Departamento"
                          checked={selectedFiltersCases.includes("Departamento")}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Departamento"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Municipio"
                          checked={selectedFiltersCases.includes("Municipio")}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Municipio"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Res emisor"
                          checked={selectedFiltersCases.includes("Res emisor")}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Res emisor"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Accion Constitucional"
                          checked={selectedFiltersCases.includes(
                            "Accion Constitucional"
                          )}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Acción Constitucional"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Subtipo Accion Constitucional"
                          checked={selectedFiltersCases.includes(
                            "Subtipo Accion Constitucional"
                          )}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Subtipo Acción Constitucional"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="Fecha Ingreso"
                          checked={selectedFiltersCases.includes("Fecha Ingreso")}
                          onChange={handleCheckboxChangeCases}
                        />
                      }
                      label="Fecha de Ingreso"
                    />
                  </>
                )}

                {casesOrResolutions === "resolutions" && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="res_fecha"
                          checked={selectedFiltersResolutions.includes(
                            "res_fecha"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Fecha de Resolución"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="res_tipo2_"
                          checked={selectedFiltersResolutions.includes(
                            "res_tipo2_"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Tipo de Resolución "
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="res_tipo_id"
                          checked={selectedFiltersResolutions.includes(
                            "res_tipo_id"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Subtipo de Resolución"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="res_fondo_voto"
                          checked={selectedFiltersResolutions.includes(
                            "res_fondo_voto"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Fondo Voto"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="res_resul"
                          checked={selectedFiltersResolutions.includes(
                            "res_resul"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Resultado de la Resolución"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="revresul"
                          checked={selectedFiltersResolutions.includes(
                            "revresul"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Revisión del Resultado"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="resfinal"
                          checked={selectedFiltersResolutions.includes(
                            "resfinal"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Resultado Final"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="restiempo"
                          checked={selectedFiltersResolutions.includes(
                            "restiempo"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Tiempo de Resolución"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="relator"
                          checked={selectedFiltersResolutions.includes("relator")}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Relator"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="departamento"
                          checked={selectedFiltersResolutions.includes(
                            "departamento"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Departamento"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="accion_constitucional"
                          checked={selectedFiltersResolutions.includes(
                            "accion_constitucional"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Acción Constitucional"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="subtipo_accion_constitucional"
                          checked={selectedFiltersResolutions.includes(
                            "subtipo_accion_constitucional"
                          )}
                          onChange={handleCheckboxChangeResolutions}
                        />
                      }
                      label="Subtipo Acción Constitucional"
                    />
                  </>
                )}
              </FormGroup>
            </div>
            <div className="filters">
              {availableSubFilters.length > 0 && (
                <div>
                  <h3>Filtrar por {selectedFiltersCases[0]}</h3>
                  <FormGroup>
                    {availableSubFilters.map((value, index) => (
                      <FormControlLabel
                        key={`${value}-${index}`}
                        control={
                          <Checkbox
                            checked={selectedSubFilters.includes(value)}
                            onChange={(event) => {
                              setSelectedSubFilters(
                                (prevFilters) =>
                                  event.target.checked
                                    ? [...prevFilters, value]
                                    : prevFilters.filter((v) => v !== value)
                              );
                            }}
                          />
                        }
                        label={value}
                      />
                    ))}
                  </FormGroup>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del Gráfico o Tabla */}

      <div
        className="d-flex flex-column justify-content-center align-items-center flex-grow-1 p-4 grafico-container"
        style={{
          flexGrow: 1,
          position: "relative",
          minWidth: 0,
          width: "100%",
        }}
      >
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
          <div style={{ Width: "100%", width: "100%"}}>
            {chartOptions ?  (
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
                style={{ width: "100%", height: "500px" }}
              >
                <p className="fw-bold fs-5" style={{ width: "100%" }}>
                  Seleccione un filtro para ver el gráfico
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%" }}>
              {chartOptions?.series && (
                <div className="d-flex justify-content-end mb-2">
                  <Button variant="contained" onClick={exportToExcel}>
                    Descargar Excel
                  </Button>
                </div>
              )}

              {/* SCROLL CONTROLADO */}
              <div style={{ overflowX: "auto", maxWidth: "100%" }}>
                <table
                  className="data-table table table-bordered table-striped"
                  style={{
                    minWidth: "600px", // Asegura un ancho mínimo para permitir el scroll
                    tableLayout: "auto",
                  }}
                >
                  <thead className="table-light">
                    <tr>
                      <th style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {casesOrResolutions === "cases"
                          ? selectedFiltersCases[0] || "Categoría 1"
                          : selectedFiltersResolutions[0] || "Categoría 1"}
                      </th>
                      {chartOptions?.series?.map((serie, index) => (
                        <th
                          key={index}
                          style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
                        >
                          {serie.name || `Categoría ${index + 2}`}
                        </th>
                      ))}
                      <th style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartOptions?.xAxis?.data?.map((primaryLabel, iCategoria) => {
                      const valoresFila = chartOptions.series.map(
                        (serie) => serie.data[iCategoria] ?? 0
                      );
                      const totalFila = valoresFila.reduce((a, b) => a + b, 0);
                      return (
                        <tr key={iCategoria}>
                          <td>{primaryLabel}</td>
                          {valoresFila.map((valor, j) => (
                            <td key={j}>{valor}</td>
                          ))}
                          <td className="fw-bold">{totalFila}</td>
                        </tr>
                      );
                    })}
                    <tr className="fw-bold">
                      <td>Total</td>
                      {chartOptions?.series?.map((serie, index) => {
                        const totalCol = serie.data.reduce((sum, val) => sum + val, 0);
                        return <td key={index}>{totalCol}</td>;
                      })}
                      <td>
                        {chartOptions?.series?.reduce(
                          (acc, serie) => acc + serie.data.reduce((s, v) => s + v, 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleSelection;
