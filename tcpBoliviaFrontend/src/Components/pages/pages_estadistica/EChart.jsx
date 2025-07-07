import React, { useEffect, useState } from "react";
import boliviaJson from "./Bolivia.json";
import ReactECharts from "echarts-for-react";
import { registerMap } from "echarts/core";
import { geoMercator } from "d3-geo";
import axios from "axios";
import { URL_API } from "../../../Services/EndPoint";

const EChart = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [departamentosConPorcentaje, setDepartamentosConPorcentaje] = useState([]);
  const [datosOriginales, setDatosOriginales] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [anioMin, setAnioMin] = useState(null);
  const [anioMax, setAnioMax] = useState(null);

  // Obtener datos por departamento
  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL_API}resoluciones/departamento`);
      setDepartamentos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos de departamentos:", error);
    }
  };

  // Obtener años disponibles
  const fetchAnios = async () => {
    try {
      const response = await axios.get(`${URL_APIs}resolucionesPorAnio`);
      const anios = response.data.map(item => item.anio);
      if (anios.length > 0) {
        setAnioMin(Math.min(...anios));
        setAnioMax(Math.max(...anios));
      }
    } catch (error) {
      console.error("Error al obtener los años:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAnios();
  }, []);

  useEffect(() => {
    if (departamentos.length > 0) {
      const maxResolution = Math.max(...departamentos.map(item => item.cantidad_resoluciones));
      const maxPercentage = Math.max(...departamentos.map(item => item.porcentaje));
      const calculatedMaxValue = Math.max(maxResolution, maxPercentage);
      setMaxValue(calculatedMaxValue);

      const nuevosDepartamentosConPorcentaje = boliviaJson.features.map(departamento => {
        const departamentoData = departamentos.find(item => item.departamento_nombre === departamento.properties.name);
        return {
          name: departamento.properties.name,
          value: departamentoData ? departamentoData.cantidad_resoluciones : 0,
          percentage: departamentoData ? departamentoData.porcentaje : 0
        };
      });

      setDepartamentosConPorcentaje(nuevosDepartamentosConPorcentaje);
      setDatosOriginales(nuevosDepartamentosConPorcentaje);
    }
  }, [departamentos]);

  registerMap("Bolivia", boliviaJson);
  const projection = geoMercator();

  const onChartEvent = (event) => {
    if (event.type === 'restore') {
      setDepartamentosConPorcentaje(datosOriginales);
    }
  };

  const tituloDinamico = anioMin && anioMax
    ? `Resoluciones Judiciales por Departamento (${anioMin}–${anioMax})`
    : 'Resoluciones Judiciales por Departamento';

  return (
    <ReactECharts
      option={{
        title: {
          text: tituloDinamico,
          subtext: "Datos de TCP Bolivia",
          left: "right",
          top: "5%",
          textStyle: { fontSize: 14 },
          subtextStyle: { fontSize: 12 }
        },
        tooltip: {
          trigger: "item",
          formatter: (params) => {
            const { name, value, data } = params;
            return `${name}<br/>Resoluciones: ${value}<br/>Porcentaje: ${data?.percentage || 0}%`;
          },
          textStyle: {
            fontSize: 14,
            fontFamily: 'Arial',
          },
        },
        visualMap: {
          left: "right",
          top: "40%",
          min: 0,
          max: maxValue,
          inRange: {
            color: ["#4575b4", "#ffffff", "#d73027"],
          },
          text: ["Alto", "Bajo"],
          calculable: true,
        },
        toolbox: {
          show: true,
          left: 'left',
          top: '5%',
          emphasis: {
            iconStyle: {
              borderColor: '#a0425e',
              color: '#a0425e',
            }
          },
          feature: {
            saveAsImage: {
              title: 'Descargar imagen',
              pixelRatio: 2
            }
          }
        },
        series: [
          {
            name: "Resoluciones",
            type: "map",
            roam: false,
            map: "Bolivia",
            projection: {
              project: point => projection(point),
              unproject: point => projection.invert(point)
            },
            label: {
              show: true,
              formatter: (params) => `${params.name}\n${params.data?.percentage || 0}%`,
              color: "#000",
              fontSize: 14,
            },
            emphasis: {
              itemStyle: {
                areaColor: "rgba(255, 215, 0, 0.4)",
              },
              label: {
                show: true,
                color: "#333",
              },
            },
            data: departamentosConPorcentaje,
          },
        ],
      }}
      style={{ height: "94vh", width: "100%" }}
      onChartEvent={onChartEvent}
    />
  );
};

export default EChart;
