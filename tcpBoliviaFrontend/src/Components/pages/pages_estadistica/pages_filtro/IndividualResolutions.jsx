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

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { URL_API } from "../../../../Services/EndPoint";

const IndividualResolutions = () => {
  const [showFilters, setShowFilters] = useState(true);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});
  const [filterType, setFilterType] = useState("");
  const [anios, setAnios] = useState([]);
  const [selectedAnio, setSelectedAnio] = useState("");
  const [selectedMes, setSelectedMes] = useState("");
  const [loading, setLoading] = useState(false);
  const [tiposResoluciones, setTiposResoluciones] = useState([]);
  const [selectedTipoResolucion, setSelectedTipoResolucion] = useState("");
  const [subTiposResoluciones, setSubTiposResoluciones] = useState([]);
  const [selectedSubTipoResolucion, setSelectedSubTipoResolucion] =
    useState("");
  const [fondosVoto, setFondosVoto] = useState([]);
  const [selectedFondoVoto, setSelectedFondoVoto] = useState("");

  const [resResulList, setResResulList] = useState([]);
  const [selectedResResul, setSelectedResResul] = useState("");

  const [revResulList, setRevResulList] = useState([]);
  const [selectedRevResul, setSelectedRevResul] = useState("");

  const [resFinalList, setResFinalList] = useState([]);
  const [selectedResFinal, setSelectedResFinal] = useState("");

  const [resTiempoList, setResTiempoList] = useState([]);
  const [selectedResTiempo, setSelectedResTiempo] = useState("");

  const [relatores, setRelatores] = useState([]);
  const [selectedRelator, setSelectedRelator] = useState("");

  const [departamentos, setDepartamentos] = useState([]);
  const [selectedDepartamento, setSelectedDepartamento] = useState("");
  const [municipios, setMunicipios] = useState([]);
  const [selectedMunicipio, setSelectedMunicipio] = useState("");

  const [accionesConstitucionales, setAccionesConstitucionales] = useState([]);
  const [selectedAccionConstitucional, setSelectedAccionConstitucional] =
    useState("");

  const [subtiposAcciones, setSubtiposAcciones] = useState([]);
  const [selectedSubtipoAccion, setSelectedSubtipoAccion] = useState("");

  const [alignment, setAlignment] = React.useState("bar");
  const [alignmentGraphicOrTable, setAlignmentGraphicOrTable] =
    React.useState("graphic");
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
    if (
      filterType === "Grafico por subtipo de resolucion" &&
      selectedTipoResolucion
    ) {
      fetchSubTiposResoluciones(selectedTipoResolucion);
    } else if (
      filterType === "Grafico por subtipo de resolucion" &&
      !selectedTipoResolucion
    ) {
      setSubTiposResoluciones([]);
      setSelectedSubTipoResolucion("");
    }
  }, [filterType, selectedTipoResolucion]);

  useEffect(() => {
    fetchAniosDisponibles();
    setChartOptions(null);
    setChartData({ labels: [], datasets: [], series: [] });
    // Cargamos los datos según el gráfico seleccionado
    switch (filterType) {
      case "Grafico por fecha de resolucion":
        fetchChartDataPorFechaResolucion(selectedAnio, selectedMes);
        break;
      case "Grafico por tipo de resolucion":
        fetchTiposResoluciones();
        fetchChartDataPorTipoResolucion(
          selectedAnio,
          selectedMes,
          selectedTipoResolucion
        );
        break;
      case "Grafico por subtipo de resolucion":
        fetchTiposResoluciones();
        fetchChartDataPorSubtipoResolucion(
          selectedAnio,
          selectedMes,
          selectedTipoResolucion,
          selectedSubTipoResolucion
        );
        break;
      case "Grafico por fondo voto":
        fetchFondosVoto();
        fetchChartDataPorFondoVoto(
          selectedAnio,
          selectedMes,
          selectedFondoVoto
        );
        break;
      case "Grafico por resresul":
        fetchResResulList();
        fetchChartDataPorResResul(selectedAnio, selectedMes, selectedResResul);
        break;
      case "Grafico por revresul":
        fetchRevResulList();
        fetchChartDataPorRevResul(selectedAnio, selectedMes, selectedRevResul);
        break;
      case "Grafico por resfinal":
        fetchResFinalList();
        fetchChartDataPorResFinal(selectedAnio, selectedMes, selectedResFinal);
        break;
      case "Grafico por restiempo":
        fetchResTiempoList();
        fetchChartDataPorResTiempo(
          selectedAnio,
          selectedMes,
          selectedResTiempo
        );
        break;
      case "Grafico por relator":
        fetchRelatores();
        fetchChartDataPorRelator(selectedAnio, selectedMes, selectedRelator);
        break;
      case "Grafico de resoluciones por departamento":
        fetchDepartamentos();
        fetchMunicipiosTodos();
        fetchChartDataPorDepartamento(
          selectedAnio,
          selectedMes,
          selectedDepartamento,
          selectedMunicipio
        );
        break;
      case "Grafico por accion constitucional":
        fetchAccionesConstitucionales();
        fetchChartDataPorAccionConstitucional(
          selectedAnio,
          selectedMes,
          selectedAccionConstitucional
        );
        break;
      case "Grafico por subtipo de accion constitucional":
        fetchAccionesConstitucionales();
        fetchSubtiposAcciones(selectedAccionConstitucional);
        fetchChartDataPorSubtipoAccion(
          selectedAnio,
          selectedMes,
          selectedAccionConstitucional,
          selectedSubtipoAccion
        );
        break;
      default:
        break;
    }
  }, [
    filterType,
    selectedAnio,
    selectedMes,
    selectedTipoResolucion,
    selectedSubTipoResolucion,
    selectedFondoVoto,
    selectedResResul,
    selectedRevResul,
    selectedResFinal,
    selectedResTiempo,
    selectedRelator,
    selectedDepartamento,
    selectedMunicipio,
    selectedAccionConstitucional,
    selectedSubtipoAccion,
  ]);

  useEffect(() => {
    if (selectedAccionConstitucional) {
      fetchSubtiposAcciones(selectedAccionConstitucional);
    } else {
      setSubtiposAcciones([]); // Si no hay selección, limpiar la lista de subtipos
    }
  }, [selectedAccionConstitucional]);

  //  Actualizar opciones del gráfico cuando cambia `chartData`
  useEffect(() => {
    if (chartData.labels.length > 0) {
      updateChartOptions(alignment);
    } else {
      setChartOptions(null);
    }
  }, [chartData, alignment]);

  const fetchAniosDisponibles = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-fecha`
      );
      const aniosUnicos = [...new Set(response.data.map((item) => item.anio))];
      setAnios(aniosUnicos);
    } catch (error) {
      console.error("Error al obtener años de resoluciones:", error);
    }
  };

  const fetchChartDataPorFechaResolucion = async (anio = "", mes = "") => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-fecha`,
        { params }
      );

      if (!response.data || response.data.length === 0) {
        setChartData({ labels: [], datasets: [] });
        setChartOptions(null);
        setTableData([]);
        return;
      }

      const formattedData = response.data;
      const uniqueYears = [
        ...new Set(formattedData.map((entry) => entry.anio)),
      ];

      let monthsWithData = new Set();
      formattedData.forEach((yearData) => {
        Object.entries(yearData.resoluciones_por_mes).forEach(
          ([month, count]) => {
            if (count > 0) {
              monthsWithData.add(Number(month));
            }
          }
        );
      });

      const filteredMonths = [...monthsWithData].sort((a, b) => a - b);

      const datasets = uniqueYears.map((year, index) => {
        const yearData = formattedData.find((entry) => entry.anio === year);
        return {
          label: `Año ${year}`,
          type: "bar",
          stack: false,
          data: filteredMonths.map(
            (month) => yearData?.resoluciones_por_mes[month] || 0
          ),
          backgroundColor: getRandomColor(index),
        };
      });

      const labels = filteredMonths.map((m) => meses[m - 1]);

      setChartData({
        labels,
        datasets,
      });

      setTableData(formattedData);
    } catch (error) {
      console.error(" Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
      setChartOptions(null);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTiposResoluciones = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/tipos-resoluciones`
      );

      setTiposResoluciones(response.data);
    } catch (error) {
      console.error("Error al obtener tipos de resoluciones:", error);
    }
  };

  const fetchChartDataPorTipoResolucion = async (
    anio = "",
    mes = "",
    tipoResolucionId = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (tipoResolucionId) params.tipo_resolucion = tipoResolucionId;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-tipo`,
        { params }
      );

      const labels = response.data
        .filter((item) => item.tipo_resolucion2)
        .map((item) => item.tipo_resolucion2);

      const counts = response.data
        .filter((item) => item.tipo_resolucion2)
        .map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubTiposResoluciones = async (tipoResolucionId) => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/subtipos-resoluciones`
      );
      const subtiposFiltrados = response.data.filter(
        (subtipo) => subtipo.res_tipo2_id === parseInt(tipoResolucionId)
      );
      setSubTiposResoluciones(subtiposFiltrados);
    } catch (error) {
      console.error("Error al obtener subtipos de resoluciones:", error);
      setSubTiposResoluciones([]);
    }
  };

  const fetchChartDataPorSubtipoResolucion = async (
    anio = "",
    mes = "",
    tipoResolucionId = "",
    subTipoResolucion = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (tipoResolucionId) params.tipo_resolucion = tipoResolucionId;
      if (subTipoResolucion) params.sub_tipo_resolucion = subTipoResolucion;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-subtipo`,
        { params }
      );

      const labels = response.data.map((item) => item.sub_tipo_resolucion);
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchFondosVoto = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-fondo-voto`
      );

      // Mapeo de valores de fondo voto
      const fondoVotoMapping = {
        1: "1 - Resolución unánime",
        2: "2 - Resolución con disidencia",
      };

      // Convertimos los valores de res_fondo_voto con su nombre descriptivo
      const fondosVotoConvertidos = response.data.map((item) => ({
        valor: item.res_fondo_voto,
        label: fondoVotoMapping[item.res_fondo_voto] || item.res_fondo_voto,
      }));

      setFondosVoto(fondosVotoConvertidos);
    } catch (error) {
      console.error("Error al obtener lista de fondos voto:", error);
    }
  };

  const fetchChartDataPorFondoVoto = async (
    anio = "",
    mes = "",
    fondoVoto = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (fondoVoto) params.res_fondo_voto = fondoVoto;

      const response = await axios.get(
      `${URL_API}estadisticas/resoluciones/por-fondo-voto`,
        { params }
      );

      // Mapeo de valores de fondo voto
      const fondoVotoMapping = {
        1: "1 - Resolución unánime",
        2: "2 - Resolución con disidencia",
      };

      // Convertimos los valores de res_fondo_voto con su nombre descriptivo
      const labels = response.data.map(
        (item) => fondoVotoMapping[item.res_fondo_voto] || item.res_fondo_voto
      );
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });

      // setChartOptions(
      //   formatChartOptions(labels, counts, "Resoluciones por Fondo Voto")
      // );
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchResResulList = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-resresul`
      );
      setResResulList(response.data);
    } catch (error) {
      console.error("Error al obtener lista de resresul:", error);
    }
  };

  const fetchChartDataPorResResul = async (
    anio = "",
    mes = "",
    resResul = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (resResul) params.resresul = resResul;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-resresul`,
        { params }
      );

      if (!response.data || response.data.length === 0) {
        setChartData({ labels: [], datasets: [] });
        setChartOptions(null);
        return;
      }

      const labels = response.data.map((item) => item.descripcion);
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchRevResulList = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-revresul`
      );

      // Mapeo de valores de revresul
      const revResulMapping = {
        1: "Confirma (aprueba) totalmente la decisión del tribunal",
        2: "Revoca totalmente",
        3: "Parcial, confirma en parte y revoca en parte",
        999: "Duda en la clasificación",
      };

      // Convertimos los valores de revresul con su nombre descriptivo
      const revResulConvertidos = response.data.map((item) => ({
        valor: item.revresul,
        label: revResulMapping[item.revresul] || item.revresul,
      }));

      setRevResulList(revResulConvertidos);
    } catch (error) {
      console.error("Error al obtener lista de revresul:", error);
    }
  };

  const fetchChartDataPorRevResul = async (
    anio = "",
    mes = "",
    revResul = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (revResul) params.revresul = revResul;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-revresul`,
        { params }
      );

      // Mapeo de valores de revresul
      const revResulMapping = {
        1: "Confirma (aprueba) totalmente la decisión del tribunal",
        2: "Revoca totalmente",
        3: "Parcial, confirma en parte y revoca en parte",
        999: "Duda en la clasificación",
      };

      // Convertimos los valores de revresul con su nombre descriptivo
      const labels = response.data.map(
        (item) => revResulMapping[item.revresul] || item.revresul
      );
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchResFinalList = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-resfinal`
      );

      // Mapeo de valores de resfinal con descripciones
      const resFinalMapping = {
        1: "Concede todo lo solicitado por el recurrente",
        2: "Deniega todo",
        3: "Parcial, concede en parte, deniega en parte",
        999: "Duda",
      };

      // Convertimos los valores de resfinal con su descripción correspondiente
      const resFinalConvertidos = response.data.map((item) => ({
        valor: item.resfinal,
        label: resFinalMapping[item.resfinal] || item.resfinal,
      }));

      setResFinalList(resFinalConvertidos);
    } catch (error) {
      console.error("Error al obtener lista de resfinal:", error);
    }
  };

  const fetchChartDataPorResFinal = async (
    anio = "",
    mes = "",
    resFinal = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (resFinal) params.resfinal = resFinal;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-resfinal`,
        { params }
      );

      // Mapeo de valores de resfinal con descripciones
      const resFinalMapping = {
        1: "Concede todo lo solicitado por el recurrente",
        2: "Deniega todo",
        3: "Parcial, concede en parte, deniega en parte",
        999: "Duda",
      };

      // Convertimos los valores de resfinal con su descripción correspondiente
      const labels = response.data.map(
        (item) => resFinalMapping[item.resfinal] || item.resfinal
      );
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchResTiempoList = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-restiempo`
      );
      setResTiempoList(response.data);
    } catch (error) {
      console.error("Error al obtener lista de restiempo:", error);
    }
  };

  const fetchChartDataPorResTiempo = async (
    anio = "",
    mes = "",
    resTiempo = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (resTiempo) params.restiempo = resTiempo;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-restiempo`,
        { params }
      );

      const labels = response.data.map(
        (item) => `Tiempo ${item.restiempo} meses`
      );
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatores = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-relatores`
      );
      setRelatores(response.data);
    } catch (error) {
      console.error("Error al obtener lista de relatores:", error);
    }
  };

  const fetchChartDataPorRelator = async (
    anio = "",
    mes = "",
    relator = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (relator) params.relator = relator;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-relator`,
        { params }
      );

      const labels = response.data.map((item) => `Relator ${item.relator}`);
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartamentos = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-departamentos`
      );
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener departamentos:", error);
    }
  };

  const fetchMunicipiosTodos = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-municipios-todos`
      );
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al obtener municipios:", error);
    }
  };

  const fetchMunicipiosPorDepartamento = async (departamentoId) => {
    if (!departamentoId) {
      fetchMunicipiosTodos(); // Si no hay departamento seleccionado, cargar todos los municipios
      return;
    }
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/lista-municipios/${departamentoId}`
      );
      setMunicipios(response.data);
    } catch (error) {
      console.error("Error al obtener municipios por departamento:", error);
    }
  };

  const fetchChartDataPorDepartamento = async (
    anio = "",
    mes = "",
    departamento = "",
    municipio = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (departamento) params.departamento_id = departamento;
      if (municipio) params.municipio_id = municipio;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-departamento`,
        { params }
      );

      const labels = response.data.map((item) => `${item.departamento} `);
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleDepartamentoChange = (e) => {
    const departamentoId = e.target.value;
    setSelectedDepartamento(departamentoId);
    setSelectedMunicipio("");
    fetchMunicipiosPorDepartamento(departamentoId);
  };

  const fetchAccionesConstitucionales = async () => {
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/acciones-constitucionales`
      );
      setAccionesConstitucionales(response.data);
    } catch (error) {
      console.error("Error al obtener acciones constitucionales:", error);
    }
  };

  const fetchChartDataPorAccionConstitucional = async (
    anio = "",
    mes = "",
    accion = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (accion) params.accion_const_id = accion;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-accion-constitucional`,
        { params }
      );

      const labels = response.data.map((item) => item.accion_constitucional);
      const counts = response.data.map((item) => item.cantidad_resoluciones);

      setChartData({
        labels,
        datasets: [{ label: "Cantidad de Resoluciones", data: counts }],
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      setChartData({ labels: [], datasets: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubtiposAcciones = async (accionId) => {
    if (!accionId) {
      setSubtiposAcciones([]); // Limpiar subtipos si no hay acción seleccionada
      return;
    }
    try {
      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/subtipos-acciones/${accionId}`
      );
      setSubtiposAcciones(response.data);
    } catch (error) {
      console.error("Error al obtener subtipos de acción:", error);
    }
  };

  const fetchChartDataPorSubtipoAccion = async (
    anio = "",
    mes = "",
    accion = "",
    subtipo = ""
  ) => {
    setLoading(true);
    try {
      const params = {};
      if (anio) params.anio = anio;
      if (mes) params.mes = mes;
      if (accion) params.accion_const_id = accion;
      if (subtipo) params.subtipo_accion_id = subtipo;

      const response = await axios.get(
        `${URL_API}estadisticas/resoluciones/por-subtipo-accion`,
        { params }
      );

      setChartData({
        labels: response.data.map((item) => item.subtipo_accion),
        datasets: [
          {
            label: "Cantidad de Resoluciones",
            data: response.data.map((item) => item.cantidad_resoluciones),
          },
        ],
      });
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
    title = "Cantidad de Resoluciones",
    chartType = "bar",
    legendLabels = []
  ) => {
    const totalResoluciones = counts
      .flat()
      .reduce((acc, curr) => acc + (curr || 0), 0);

    const isSubtipoResolucion =
      filterType === "Grafico por subtipo de resolucion";
    const isSubtipoAccion =
      filterType === "Grafico por subtipo de accion constitucional";

    const truncateLabel = (label, maxLength = 20) => {
      if (typeof label !== "string") return label;
      return label.length > maxLength
        ? label.substring(0, maxLength - 3) + "..."
        : label;
    };

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

    const options = {
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
        formatter: (params) => {
          if (chartType === "pie") {
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
          text: `Total: ${totalResoluciones}`,
          fontSize: 12,
          fontWeight: "bold",
          color: "#333",
        },
      },
      series: [],
    };

    if (chartType === "pie") {
      // Eliminar completamente grid, xAxis, yAxis y dataZoom para gráficos "pie"
      options.grid = undefined;
      options.xAxis = undefined;
      options.yAxis = undefined;
      options.dataZoom = undefined;

      if (filterType === "Grafico por fecha de resolucion") {
        options.series = counts.map((data, index) => ({
          name: legendLabels[index],
          type: "pie",
          radius: [`${10 + index * 10}%`, `${20 + index * 10}%`],
          center: ["50%", "50%"],
          label: {
            show: true,
            position: "outside",
            formatter: (params) => {
              const truncatedName = truncateLabel(params.name, 15);
              return `${truncatedName}: ${params.value} (${params.percent}%)`;
            },
            fontSize: 12,
          },
          data: labels.map((label, idx) => ({
            name: label,
            value: data[idx] || 0,
            itemStyle: { color: getRandomColor(idx) },
          })),
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold",
            },
          },
        }));

        options.legend = {
          top: "8%",
          left: "center",
          orient: "horizontal",
          type: "scroll",
          data: legendLabels,
          formatter: (name) => truncateLabel(name, 25),
        };
      } else {
        options.series = [
          {
            name: title,
            type: "pie",
            radius: "50%",
            center: ["50%", "50%"],
            label: {
              show: true,
              position: "outside",
              formatter: (params) => {
                const truncatedName = truncateLabel(params.name, 15);
                return `${truncatedName}: ${params.value} (${params.percent}%)`;
              },
              fontSize: 12,
            },
            data: labels.map((label, index) => ({
              name: label,
              value: counts[index],
              itemStyle: { color: getRandomColor(index) },
            })),
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
          top: "8%",
          left: "center",
          orient: "horizontal",
          type: "scroll",
          data: labels,
          formatter: (name) => truncateLabel(name, 25),
        };
      }
    } else {
      // Configurar grid solo para gráficos que no son "pie"
      options.grid = {
        top: 120,
        containLabel: true,
        bottom: isSubtipoResolucion ? 100 : isSubtipoAccion ? 20 : 50,
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

      if (filterType === "Grafico por fecha de resolucion") {
        options.legend = {
          top: "15%",
          left: "center",
          orient: "horizontal",
          type: "scroll",
          data: legendLabels.length > 0 ? legendLabels : [],
          formatter: (name) => truncateLabel(name, 25),
        };

        options.series = counts.map((data, index) => ({
          name: legendLabels[index],
          type: chartType,
          stack: "total",
          data: data,
          itemStyle: { color: getRandomColor(index) },
        }));
      } else {
        options.legend = { show: false };
        options.series = [
          {
            name: title,
            type: chartType,
            data: Array.isArray(counts[0]) ? counts[0] : counts,
            itemStyle: { color: getRandomColor() },
          },
        ];
      }

      if (labels.length > 30) {
        options.dataZoom = [{ type: "slider", start: 0, end: 20 }];
      }
    }

    return options;
  };

  const updateChartOptions = (chartType) => {
    if (chartData.labels.length === 0) return;

    let chartTitle = "Cantidad de Resoluciones";
    let legendLabels = [];

    //  Si el gráfico NO es por fecha, restablecer el estado
    if (filterType !== "Grafico por fecha de resolucion") {
      const labels = chartData.labels;
      const counts = chartData.datasets[0]?.data || [];

      setChartOptions(
        formatChartOptions(labels, counts, chartTitle, chartType)
      );
      return;
    }

    //  Si es el gráfico por fecha, mantener la leyenda por año
    chartTitle = "Resoluciones por Fecha";
    legendLabels = chartData.datasets.map((dataset) => dataset.label);

    setChartOptions(
      formatChartOptions(
        chartData.labels,
        chartData.datasets.map((d) => d.data),
        chartTitle,
        chartType,
        legendLabels
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
      setChartOptions(null); // Restablecer chartOptions
      if (newAlignment === "pie") {
        setChartOptions((prevOptions) => {
          if (!prevOptions) return null;
          const newOptions = { ...prevOptions };
          delete newOptions.xAxis;
          delete newOptions.yAxis;
          delete newOptions.dataZoom;
          return newOptions;
        });
      }

      updateChartOptions(newAlignment); //  Recalcula todas las opciones del gráfico
    }
  };

  const handleChangeGraphicOrTable = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignmentGraphicOrTable(newAlignment);
    }
  };

  const exportToExcel = () => {
    let exportData = [];
    let tableHeaders = [];
    let fileName = "Datos_Exportados.xlsx";

    if (
      filterType === "Grafico de casos por fecha" ||
      filterType === "Grafico por fecha de resolucion"
    ) {
      //  Exportación para tablas de casos y resoluciones por fecha
      const years = [...new Set(tableData.map((item) => item.anio))].sort();
      tableHeaders = ["Mes", ...years, "Total"];
      fileName =
        filterType === "Grafico de casos por fecha"
          ? "Casos_Por_Fecha.xlsx"
          : "Resoluciones_Por_Fecha.xlsx";

      const groupedData = meses.map((mes, mesIndex) => {
        const row = [mes];
        let totalMes = 0;

        years.forEach((year) => {
          const dataPoint = tableData.find((item) => item.anio === year);
          let value = 0;

          if (filterType === "Grafico de casos por fecha") {
            //  Obtener cantidad de casos por mes
            value = dataPoint ? dataPoint.casos_por_mes[mesIndex + 1] || 0 : 0;
          } else if (filterType === "Grafico por fecha de resolucion") {
            //  Obtener cantidad de resoluciones por mes
            value = dataPoint
              ? dataPoint.resoluciones_por_mes[mesIndex + 1] || 0
              : 0;
          }

          row.push(value);
          totalMes += value;
        });

        row.push(totalMes);
        return row;
      });

      //  Calcular totales por año y total general
      const totalRow = ["Total General"];
      let totalGeneral = 0;

      years.forEach((year) => {
        const total = groupedData.reduce(
          (acc, row) => acc + row[years.indexOf(year) + 1],
          0
        );
        totalRow.push(total);
        totalGeneral += total;
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

  const renderTableResoluciones = () => {
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
        const dataPoint = tableData.find((item) => item.anio === year);

        //  Obtener la cantidad de resoluciones para el mes correspondiente
        row[year] = dataPoint
          ? dataPoint.resoluciones_por_mes[mesIndex + 1] || 0
          : 0;
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

  let dynamicHeight = 500;

  return (

    
    <div
       className="d-flex flex-row mt-2"
  style={{ height: "100%", width: "100%" }}
    >
      {showFilters && (
      <div
        className="bg-light p-4 shadow-sm filtros-container"
  style={{
    width: "500px",   // ancho fijo para filtro cuando visible
    maxWidth: "590px",
    borderRight: "2px solid #ddd",
    transition: "width 0.3s ease, opacity 0.3s ease",
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
            className="second-toggle"
          >
            <ToggleButton value="graphic">Gráfico</ToggleButton>
            <ToggleButton value="table">Tabla</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <h2 className="fw-bold text-left mt-2">Filtrar Datos</h2>

        <Box>
          {/* Selector de Gráficos de Resoluciones Individuales */}
          <FormControl fullWidth className="mt-2">
            <InputLabel>Tipo de Gráfico</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value={"Grafico por fecha de resolucion"}>
                Gráfico por Fecha de Resolución
              </MenuItem>
              <MenuItem value={"Grafico por tipo de resolucion"}>
                Gráfico por Tipo de Resolución
              </MenuItem>
              <MenuItem value={"Grafico por subtipo de resolucion"}>
                Gráfico por Subtipo de Resolución
              </MenuItem>
              <MenuItem value={"Grafico por fondo voto"}>
                Gráfico por Fondo Voto
              </MenuItem>
              <MenuItem value={"Grafico por resresul"}>
                Gráfico por Resultado de la Resolución
              </MenuItem>
              <MenuItem value={"Grafico por revresul"}>
                Gráfico por Revisión del Resultado
              </MenuItem>
              <MenuItem value={"Grafico por resfinal"}>
                Gráfico por Resultado Final
              </MenuItem>
              <MenuItem value={"Grafico por restiempo"}>
                Gráfico por Tiempo de Resolución
              </MenuItem>
              <MenuItem value={"Grafico por relator"}>
                Gráfico por Relator
              </MenuItem>
              <MenuItem value={"Grafico de resoluciones por departamento"}>
                Gráfico por Departamento
              </MenuItem>
              <MenuItem value={"Grafico por accion constitucional"}>
                Gráfico por Acción Constitucional
              </MenuItem>
              <MenuItem value={"Grafico por subtipo de accion constitucional"}>
                Gráfico por Subtipo de Acción Constitucional
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>

          {/* Selectores dinámicos según la opción elegida */}
          {filterType === "Grafico por fecha de resolucion" && (
            <>
            
              <FormControl fullWidth className="mt-3">
                <InputLabel>Año</InputLabel>
                <Select
                  value={selectedAnio}
                  onChange={(e) => setSelectedAnio(e.target.value)}
                >
                  <MenuItem value="">Todos los Años</MenuItem>
                  {anios.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth className="mt-3">
                <InputLabel>Mes</InputLabel>
                <Select
                  value={selectedMes}
                  onChange={(e) => setSelectedMes(e.target.value)}
                >
                  <MenuItem value="">Todos los Meses</MenuItem>
                  {meses.map((mes, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {mes}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {/* Gráfico por Tipo de Resolución */}
          {filterType === "Grafico por tipo de resolucion" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>Tipo de Resolución</InputLabel>
              <Select
                value={selectedTipoResolucion}
                onChange={(e) => setSelectedTipoResolucion(e.target.value)}
              >
                <MenuItem value="">Todos los Tipos</MenuItem>
                {tiposResoluciones.map((tipo) => (
                  <MenuItem key={tipo.tipo_resolucion} value={tipo.id}>
                    {tipo.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por Subtipo de Resolución */}
          {filterType === "Grafico por subtipo de resolucion" && (
            <>
              <FormControl fullWidth className="mt-3">
                <InputLabel>Tipo de Resolución</InputLabel>
                <Select
                  value={selectedTipoResolucion}
                  onChange={(e) => {
                    setSelectedTipoResolucion(e.target.value);
                    // fetchSubTiposResoluciones ya se maneja en el useEffect
                  }}
                >
                  <MenuItem value="">Todos los Tipos</MenuItem>
                  {tiposResoluciones.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth className="mt-3">
                <InputLabel>Subtipo de Resolución</InputLabel>
                <Select
                  value={selectedSubTipoResolucion}
                  onChange={(e) => setSelectedSubTipoResolucion(e.target.value)}
                  disabled={!selectedTipoResolucion}
                >
                  <MenuItem value="">Todos los Subtipos</MenuItem>
                  {subTiposResoluciones.map((subtipo) => (
                    <MenuItem key={subtipo.id} value={subtipo.id}>
                      {subtipo.descripcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {/* Gráfico por Fondo Voto */}
          {filterType === "Grafico por fondo voto" && (
            <>
              <FormControl fullWidth className="mt-3">
                <InputLabel>Fondo Voto</InputLabel>
                <Select
                  value={selectedFondoVoto}
                  onChange={(e) => setSelectedFondoVoto(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {fondosVoto.map((item) => (
                    <MenuItem key={item.valor} value={item.valor}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {/* Gráfico por ResResul */}
          {filterType === "Grafico por resresul" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>ResResul</InputLabel>
              <Select
                value={selectedResResul}
                onChange={(e) => setSelectedResResul(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {resResulList.map((item) => (
                  <MenuItem key={item.resresul} value={item.resresul}>
                    {item.descripcion}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por RevResul */}
          {filterType === "Grafico por revresul" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>RevResul</InputLabel>
              <Select
                value={selectedRevResul}
                onChange={(e) => setSelectedRevResul(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {revResulList.map((item) => (
                  <MenuItem key={item.valor} value={item.valor}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por ResFinal */}
          {filterType === "Grafico por resfinal" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>ResFinal</InputLabel>
              <Select
                value={selectedResFinal}
                onChange={(e) => setSelectedResFinal(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {resFinalList.map((item) => (
                  <MenuItem key={item.valor} value={item.valor}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por Tiempo de Resolución */}
          {filterType === "Grafico por restiempo" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>Tiempo de Resolución</InputLabel>
              <Select
                value={selectedResTiempo}
                onChange={(e) => setSelectedResTiempo(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {resTiempoList.map((item) => (
                  <MenuItem key={item.restiempo} value={item.restiempo}>
                    {item.restiempo} meses
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por Relator */}
          {filterType === "Grafico por relator" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>Relator</InputLabel>
              <Select
                value={selectedRelator}
                onChange={(e) => setSelectedRelator(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {relatores.map((item) => (
                  <MenuItem key={item.relator} value={item.relator}>
                    {item.relator}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico de Resoluciones por Departamento */}
          {filterType === "Grafico de resoluciones por departamento" && (
            <>
              <FormControl fullWidth className="mt-3">
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={selectedDepartamento}
                  onChange={handleDepartamentoChange}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {departamentos.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {filterType === "Grafico por accion constitucional" && (
            <FormControl fullWidth className="mt-3">
              <InputLabel>Acción Constitucional</InputLabel>
              <Select
                value={selectedAccionConstitucional}
                onChange={(e) =>
                  setSelectedAccionConstitucional(e.target.value)
                }
              >
                <MenuItem value="">Todas</MenuItem>
                {accionesConstitucionales.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Gráfico por Subtipo de Acción Constitucional */}
          {filterType === "Grafico por subtipo de accion constitucional" && (
            <>
              <FormControl fullWidth className="mt-3">
                <InputLabel>Acción Constitucional</InputLabel>
                <Select
                  value={selectedAccionConstitucional}
                  onChange={(e) =>
                    setSelectedAccionConstitucional(e.target.value)
                  }
                >
                  <MenuItem value="">Todas</MenuItem>
                  {accionesConstitucionales.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth className="mt-3">
                <InputLabel>Subtipo de Acción</InputLabel>
                <Select
                  value={selectedSubtipoAccion}
                  onChange={(e) => setSelectedSubtipoAccion(e.target.value)}
                  disabled={!selectedAccionConstitucional} // Deshabilitado si no hay acción constitucional seleccionada
                >
                  <MenuItem value="">Todos</MenuItem>
                  {subtiposAcciones.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </div>
)}
      {/* Contenedor del Gráfico o Tabla */}
      <div
       
  className="d-flex flex-column justify-content-start align-items-center p-4 grafico-container"
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
          <div
            className="table-responsive"
            style={{ maxWidth: "900px", width: "100%" }}
          >
            {(tableData.length > 0 || chartData.labels.length > 0) && (
              <div className="d-flex justify-content-end mb-2">
                <Button variant="contained" onClick={exportToExcel}>
                  Descargar Excel
                </Button>
              </div>
            )}

            {filterType === "Grafico por fecha de resolucion" ? (
              renderTableResoluciones()
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
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>
                        {chartData.datasets[0]?.data.reduce(
                          (acc, curr) => acc + curr,
                          0
                        )}
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

export default IndividualResolutions;
