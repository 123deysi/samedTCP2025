import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

import { Import } from 'lucide-react';
import { URL_API } from '../../../Services/EndPoint';
const GraficoCasos = () => {
  const [datosFiltrados, setDatosFiltrados] = useState([]);
  const [anioMin, setAnioMin] = useState(null);
  const [anioMax, setAnioMax] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const [casosResponse, resolucionesResponse] = await Promise.all([
          axios.get(`${URL_API}casosPorAnio`),
          axios.get(`${URL_API}resolucionesPorAnio`)
        ]);

        const casosData = casosResponse.data;
        const resolucionesData = resolucionesResponse.data;

        const todosAnios = Array.from(new Set([
          ...casosData.map(caso => caso.anio),
          ...resolucionesData.map(resolucion => resolucion.anio)
        ])).sort();

        const anioMinimo = Math.min(...todosAnios);
        const anioMaximo = Math.max(...todosAnios);
        setAnioMin(anioMinimo);
        setAnioMax(anioMaximo);

        const datosCombinados = todosAnios.map(anio => {
          const caso = casosData.find(c => c.anio === anio);
          const resolucion = resolucionesData.find(r => r.anio === anio);
          return {
            año: anio,
            cantidad_casos: caso ? caso.cantidad_casos : 0,
            cantidad_resoluciones: resolucion ? resolucion.cantidad_resoluciones : 0
          };
        });

        setDatosFiltrados(datosCombinados);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  const opcionesGrafico = {
    title: {
      text:
        anioMin && anioMax
          ? `Causas y Resoluciones por Año (${anioMin}–${anioMax})`
          : 'Causas y Resoluciones por Año',
      left: 'center',
      top: '5%',
      textStyle: {
        fontSize: 14,
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        let contenido = `<strong>Año: ${params[0].axisValue}</strong><br/>`;
        params.forEach(param => {
          contenido += `${param.marker} ${param.seriesName}: ${param.value}<br/>`;
        });
        return contenido;
      }
    },
    toolbox: {
      show: true,
      top: 'top',
      left: 'right',
      emphasis: {
        iconStyle: {
          borderColor: '#a0425e',
          color: '#a0425e'
        }
      },
      feature: {
        magicType: {
          show: true,
          type: ['line', 'bar', 'stack'],
          title: {
            line: 'Cambiar a línea',
            bar: 'Cambiar a barras',
            stack: 'Apilar'
          }
        },
        restore: {
          show: true,
          title: 'Restaurar'
        },
        saveAsImage: {
          show: true,
          title: 'Descargar imagen',
          pixelRatio: 2
        }
      }
    },
    legend: {
      data: ['Causas', 'Resoluciones'],
      top: '12%',
      left: 'center'
    },
    grid: {
      top: '20%',
      left: '10%',
      right: '10%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: datosFiltrados.map((item) => item.año),
      axisPointer: { type: 'shadow' }
    },
    yAxis: {
      type: 'value',
      name: 'Cantidad',
      min: 0,
      axisLabel: { formatter: '{value}' }
    },
    series: [
      {
        name: 'Causas',
        type: 'bar',
        data: datosFiltrados.map((item) => item.cantidad_casos),
        itemStyle: { color: '#77bab5' }
      },
      {
        name: 'Resoluciones',
        type: 'bar',
        data: datosFiltrados.map((item) => item.cantidad_resoluciones),
        itemStyle: { color: '#a0425e' }
      }
    ]
  };

  const onChartEvent = {
    restore: () => {
      setDatosFiltrados((prevData) => [...prevData]);
    }
  };

  return (
    <div className="container-grafico" id="grafico-casos-container">
      <div style={{ width: '100%', height: '500px' }}>
        <ReactECharts
          option={opcionesGrafico}
          onEvents={onChartEvent}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default GraficoCasos;
