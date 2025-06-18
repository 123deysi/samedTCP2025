import React, { useState, useEffect } from "react";
import axios from "axios";

import ReactECharts from "echarts-for-react";

const PageFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState("casos");

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
  const [error, setError] = useState(null);

  const [subTiposAcciones, setSubTiposAcciones] = useState([]);
  const [selectedSubTipoAccion, setSelectedSubTipoAccion] = useState("");

  const [accionesConstitucionales, setAccionesConstitucionales] = useState([]);
  const [selectedAccionConstitucional, setSelectedAccionConstitucional] =
    useState("");

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

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    fetchDepartamentos();
    fetchMunicipios();
    fetchAniosDisponibles();
    fetchResEmisores();
    fetchSubTiposAcciones();
    fetchAccionesConstitucionales();
  }, []);

  useEffect(() => {
    switch (filterType) {
      case "Grafico por departamento":
        fetchChartData(selectedDepartment);
        break;
      case "Grafico por municipio":
        fetchChartDataMunicipios(selectedMunicipio);
        break;
      case "Grafico de casos por fecha":
        fetchChartDataPorFecha(selectedAnio, selectedMes);
        break;
      case "Grafico por res emisor":
        fetchChartDataPorResEmisor(selectedResEmisor);
        break;
      case "Grafico por tipo de resoluciones":
        fetchChartDataPorTipoResolucion();
        break;
      case "Grafico por acción constitucional":
        fetchChartDataAccionConstitucional(selectedAccionConstitucional);
        break;
      case "Grafico por sub tipo de acciones":
        fetchChartDataPorSubTipoAccion(selectedSubTipoAccion);
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
  ]);

  // 🔹 Actualizar opciones del gráfico cuando cambia `chartData`
  useEffect(() => {
    if (chartData.labels.length > 0) {
      updateChartOptions();
    }
  }, [chartData]);

  // 🔹 Obtener lista de departamentos
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

  // 🔹 Obtener lista de municipios
  const fetchMunicipios = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/municipios"
      );
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al obtener municipios:", error);
    }
  };

  // 🔹 Obtener lista de años disponibles
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

  // 🔹 Obtener datos por departamento
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
        formatChartOptions(labels, counts, "Casos por Departamento")
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener datos por municipio
  const fetchChartDataMunicipios = async (municipio = "") => {
    setLoading(true);
    try {
      const params = municipio ? { municipios_id: municipio } : {};
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-departamento-municipio",
        { params }
      );
      const formattedData = formatChartData(response.data, "municipio");
      setChartData(formattedData);
      const labels = response.data.map((item) => item.municipio);
      const counts = response.data.map((item) => item.cantidad_casos);

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Municipio")
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener datos por fecha
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
      const formattedData = formatChartDataPorFecha(response.data);
      setChartData(formattedData);
      const labels = response.data.map((item) => meses[item.mes - 1]);
      const counts = response.data.map((item) => item.cantidad_casos);

      setChartOptions(formatChartOptions(labels, counts, "Casos por Fecha"));
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener lista de res emisores
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

  // 🔹 Formatear datos para gráficos generales
  const formatChartData = (data, key) => {
    return {
      labels: data.map((item) => item[key]),
      datasets: [
        {
          label: "Cantidad de Casos",
          data: data.map((item) => item.cantidad_casos),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

  // 🔹 Formatear datos para el gráfico por fecha
  const formatChartDataPorFecha = (data) => {
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
    return {
      labels: meses,
      datasets: [
        {
          label: "Casos",
          data: new Array(12)
            .fill(0)
            .map(
              (_, i) => data.find((d) => d.mes === i + 1)?.cantidad_casos || 0
            ),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

  // 🔹 Obtener datos por res emisor
  const fetchChartDataPorResEmisor = async (resEmisor = "") => {
    setLoading(true);
    try {
      const params = resEmisor ? { res_emisor_id: resEmisor } : {};
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-res-emisor",
        { params }
      );
      const formattedData = formatChartData(response.data, "res_emisor");
      setChartData(formattedData);
      const labels = response.data.map((item) => item.res_emisor);
      const counts = response.data.map((item) => item.cantidad_casos);

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Res Emisor")
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener lista de sub tipos de acciones
  const fetchSubTiposAcciones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/subtipos-acciones"
      );
      setSubTiposAcciones(response.data);
    } catch (error) {
      console.error("Error al obtener subtipos de resoluciones:", error);
    }
  };

  // 🔹 Obtener datos por Subtipo de accion
  const fetchChartDataPorSubTipoAccion = async (subTipoAccion = "") => {
    setLoading(true);
    try {
      const params = subTipoAccion ? { sub_tipo_accion: subTipoAccion } : {};
      const response = await axios.get(
        "http://localhost:8000/api/estadisticas/casos/por-subtipo-accion",
        { params }
      );

      const dataArray = response.data.data || []; // Asegura que sea un array
      const labels = dataArray.map(
        (item) => `${item.accion_const_nombre} - ${item.sub_tipo_nombre}`
      );
      const counts = dataArray.map((item) => item.cantidad_casos);

      const formattedData = formatChartData(dataArray, "sub_tipo_nombre");
      setChartData(formattedData);

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Subtipo de Accion")
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Obtener lista de acciones constitucionales
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

  // 🔹 Obtener datos de "Casos por Acción Constitucional"
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

      const dataArray = response.data.data || []; // Asegura que sea un array
      const labels = dataArray.map((item) => item.accion_const_nombre);
      const counts = dataArray.map((item) => item.cantidad_casos);

      const formattedData = formatChartData(dataArray, "accion_const_nombre");
      setChartData(formattedData);

      setChartOptions(
        formatChartOptions(labels, counts, "Casos por Acción Constitucional")
      );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const formatChartOptions = (
    labels,
    counts,
    title = "Cantidad de Casos",
    chartType = "bar",
    dataColor = getRandomColor()
  ) => {
    return {
      title: {
        text: title,
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: chartType === "pie" ? "item" : "axis",
        formatter: chartType === "pie" ? "{a} <br/>{b}: {c} ({d}%)" : undefined,
        axisPointer: chartType !== "pie" ? { type: "shadow" } : undefined,
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
        },
      },
      xAxis:
        chartType !== "pie"
          ? {
              type: "category",
              data: labels,
              axisPointer: { type: "shadow" },
              axisLabel: {
                rotate: 45, // Inclina las etiquetas para mayor legibilidad
                interval: 0, // Muestra todas las etiquetas
              },
            }
          : undefined,
      yAxis:
        chartType !== "pie"
          ? {
              type: "value",
              name: "Cantidad",
              min: 0,
            }
          : undefined,
      series: [
        {
          name: title,
          type: chartType,
          data:
            chartType === "pie"
              ? labels.map((label, index) => ({
                  name: label,
                  value: counts[index],
                }))
              : counts,
          itemStyle: {
            color: dataColor,
          },
          label: {
            show: true, // Siempre mostrar los valores en las barras
            position: "top", // Arriba de cada barra
            color: "#000", // Color del texto
            fontSize: 12,
            fontWeight: "bold",
          },
          emphasis:
            chartType === "pie"
              ? {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: dataColor,
                  },
                }
              : undefined,
        },
      ],
      graphic: {
        type: "text",
        left: "center",
        top: "5%",
        style: {
          text: `${title}: ${counts.reduce((acc, curr) => acc + curr, 0)}`,
          fontSize: 11,
          color: dataColor,
        },
      },
    };
  };

  let getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // 🔹 Actualizar configuración del gráfico
  const updateChartOptions = (data, totalCasos = 0) => {
    if (chartData.labels.length === 0) return;

    // Definir texto y nombre según el tipo de gráfico seleccionado
    let chartTitle = "Cantidad de Resoluciones por Tipo";
    let seriesName = "Cantidad de Resoluciones";

    if (
      filterType === "Grafico por departamento" ||
      filterType === "Grafico por res emisor" ||
      filterType === "Grafico de casos por fecha" ||
      filterType === "Grafico por municipio" ||
      filterType === "Grafico por acción constitucional" ||
      filterType === "Grafico por sub tipo de acciones"
    ) {
      chartTitle = "Cantidad de Casos";
      seriesName = "Cantidad de Casos";
    }

    setChartOptions({
      title: {
        text: `${chartTitle}`,
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        formatter: (params) => {
          let tooltipText = `<b>${params[0].axisValue}</b><br/>`;
          tooltipText += `${params[0].marker} ${params[0].seriesName}: <b>${params[0].data}</b><br/>`;

          // Si es gráfico por Res Emisor, agregar descripción en el tooltip
          if (
            filterType === "Grafico por res emisor" &&
            resEmisores.length > 0
          ) {
            const resEmisor = resEmisores.find(
              (res) => res.res_emisor === params[0].axisValue
            );
            if (resEmisor && resEmisor.res_emisor_descripcion) {
              tooltipText += `📌 Descripción: <i>${resEmisor.res_emisor_descripcion}</i>`;
            }
          }

          return tooltipText;
        },
      },
      xAxis: {
        type: "category",
        data: chartData.labels,
        axisPointer: { type: "shadow" },
        axisLabel: {
          rotate: 45,
          interval: 0,
        },
      },
      yAxis: {
        type: "value",
        name: "Cantidad",
        min: 0,
      },
      series: [
        {
          name: seriesName,
          type: "bar",
          data: chartData.datasets[0]?.data,
          itemStyle: {
            color: getRandomColor(),
          },
          label: {
            show: true,
            position: "top",
            fontSize: 12,
            fontWeight: "bold",
          },
        },
      ],
    });
  };

  return (
    <div className="fondo_Dinamica">
      <div className="letra">DINÁMICAS</div>
      <div className="contenedor_principal">
        <div className="card-header bg-dorado d-flex align-items-center">
          <h3 className="font-weight-bold mb-0">
            <i className="fa fa-filter"></i> Filtrar Datos
          </h3>
        </div>

        {/* Opciones de selección */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <label className="font-weight-bold">
            Seleccione un tipo de gráfico:
          </label>
          <div className="d-flex gap-3">
            <label>
              <input
                type="checkbox"
                checked={selectedFilter === "casos"}
                onChange={() => setSelectedFilter("casos")}
              />{" "}
              Casos individuales
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedFilter === "resoluciones"}
                onChange={() => setSelectedFilter("resoluciones")}
              />{" "}
              Resoluciones individuales
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedFilter === "multiple"}
                onChange={() => setSelectedFilter("multiple")}
              />{" "}
              Selección múltiple
            </label>
          </div>
        </div>

        {/* Gráficos de Casos Individuales */}
        {selectedFilter === "casos" && (
          <div className="mb-3">
            <label className="font-weight-bold d-block">
              Gráficos de Casos Individuales:
            </label>
            <br />
            <select
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
              className="p-3 bg-white w-100"
            >
              <option value="">Seleccione...</option>
              <option value="Grafico por departamento">
                Gráfico por Departamento
              </option>
              <option value="Grafico por municipio">
                Gráfico por Municipio
              </option>
              <option value="Grafico de casos por fecha">
                Gráfico de Casos por Fecha
              </option>
              <option value="Grafico por res emisor">
                Gráfico por Res Emisor
              </option>
              <option value="Grafico por acción constitucional">
                Gráfico por Acción Constitucional
              </option>
              <option value="Grafico por sub tipo de acciones">
                Gráfico por Subtipo de Acciones
              </option>
            </select>
          </div>
        )}

        {selectedFilter === "resoluciones" && (
          <div className="mb-3">
            <label className="font-weight-bold d-block">
              Gráficos de Resoluciones Individuales:
            </label>
            <select className="p-3 bg-white w-100">
              <option value="">Seleccione...</option>
              {/* Aquí se agregarán opciones más adelante */}
            </select>
          </div>
        )}

        {selectedFilter === "multiple" && (
          <div className="mb-3">
            <label className="font-weight-bold d-block">
              Selección Múltiple:
            </label>
            <p>
              Próximamente se agregará la funcionalidad de selección múltiple.
            </p>
          </div>
        )}

        {/* Selectores dinámicos casos individuales*/}

        {filterType === "Grafico por departamento" && (
          <select onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Todos</option>
            {departamentos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        )}

        {filterType === "Grafico por municipio" && (
          <select onChange={(e) => setSelectedMunicipio(e.target.value)}>
            <option value="">Todos</option>
            {municipios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        )}

        {filterType === "Grafico de casos por fecha" && (
          <>
            <select onChange={(e) => setSelectedAnio(e.target.value)}>
              <option value="">Seleccionar año</option>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <select onChange={(e) => setSelectedMes(e.target.value)}>
              <option value="">Seleccionar mes</option>

              {[...Array(12).keys()].map((m) => (
                <option key={m} value={m + 1}>
                  {meses[m]}
                </option>
              ))}
            </select>
          </>
        )}

        {filterType === "Grafico por res emisor" && (
          <select onChange={(e) => setSelectedResEmisor(e.target.value)}>
            <option value="">Todos</option>
            {resEmisores.map((res) => (
              <option key={res.res_emisor_id} value={res.res_emisor_id}>
                {res.res_emisor}
              </option>
            ))}
          </select>
        )}

        {/* Selector de acción constitucional */}
        {filterType === "Grafico por acción constitucional" && (
          <select
            onChange={(e) => setSelectedAccionConstitucional(e.target.value)}
          >
            <option value="">Todas las Acciones Constitucionales</option>
            {accionesConstitucionales.map((accion) => (
              <option key={accion.id} value={accion.id}>
                {accion.nombre}
              </option>
            ))}
          </select>
        )}

        {/* Selector de sub tipo de resolución */}
        {filterType === "Grafico por sub tipo de acciones" && (
          <select onChange={(e) => setSelectedSubTipoAccion(e.target.value)}>
            <option value="">Todos los Subtipos de Acciones</option>
            {subTiposAcciones.map((subtipo) => (
              <option
                key={subtipo.sub_tipo_nombre}
                value={subtipo.sub_tipo_nombre}
              >
                {subtipo.sub_tipo_nombre}
              </option>
            ))}
          </select>
        )}

        <div style={{ maxWidth: "900px", width: "100%", margin: "0 auto" }}>
          {chartOptions ? (
            <ReactECharts option={chartOptions} style={{ height: "400px" }} />
          ) : (
            <p>Seleccione un filtro para ver el gráfico</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageFilter;
