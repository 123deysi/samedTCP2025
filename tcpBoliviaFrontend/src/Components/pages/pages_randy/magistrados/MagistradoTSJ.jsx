import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../Loading";

import LineChart from "../LineChart";
const MagistradoTSJ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [xAxis, setXAxis] = useState([]);
  useEffect(() => {
    const endpoint = "http://localhost:8000/api";
    const getEstadisticas = async () => {
      try {
        const response = await axios.get(
          `${endpoint}/magistrado-estadisticas/${id}`
        );

        setXAxis(response.data.data.id);
        //console.log(response.data.data);
        setData(response.data.data.data);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getEstadisticas();
  }, [id]);

  const x = data.map((item) => item.year);
  const leyenda = xAxis;
  const [chartType, setChartType] = useState("line");
  const [suavizar, setSuavizar] = useState(false);
  const [area, setArea] = useState(false);

  const toggleChartType = () => {
    setChartType((prevType) => {
      if (prevType === "line") return "bar";
      if (prevType === "bar") return "pie";
      return "line";
    });
  };
  const handleRadioChange = (event) => {
    setChartType(event.target.value);
  };

  const cambiarArea = (event) => {
    if (area) {
      setArea(false);
    } else {
      setArea(true);
    }
  };
  const cambiarSuavizar = (event) => {
    if (suavizar) {
      setSuavizar(false);
    } else {
      setSuavizar(true);
    }
  };
  // Configuración de la serie basada en el tipo de gráfico seleccionado
  const getSeries = () => {
    if (chartType === "pie") {
      return [
        {
          name: leyenda,
          type: "pie",
          radius: "50%",
          data: data.map((item) => ({ value: item.cantidad, name: item.year })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ];
    }

    return [
      {
        data: data.map((item) => item.cantidad),
        name: leyenda,
        type: chartType,
        smooth: chartType === "line" && suavizar ? true : false, // Smooth solo se aplica a líneas
        areaStyle: chartType === "line" && area ? {} : null, // areaStyle solo se aplica a líneas
      },
    ];
  };

  const option = {
    tooltip: {
      trigger: chartType === "pie" ? "item" : "axis",
    },
    legend: { data: [leyenda] },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis:
      chartType === "pie"
        ? null
        : {
            type: "category",
            boundaryGap: chartType === "line" ? false : true,
            data: x,
          },
    yAxis:
      chartType === "pie"
        ? null
        : {
            type: "value",
          },
    series: getSeries(),
  };

  return (
    <div style={{ height: 800 }} className="p-4 m-4">
      <h1 className="text-center font-bold text-4xl">Cantidad de resoluciones por año</h1>
      <div className="p-4 m-4 flex flex-row flex-wrap gap-4 justify-center">
        <div className="p-4 m-4 flex items-center justify-center">
          {data.length > 0 ? (
            <LineChart option={option} />
          ) : (
            <div style={{ width: 700 }} className="flex justify-center">
              <Loading />
            </div>
          )}
        </div>
        <div className="p-4 m-4 bg-gray-200 flex flex-col">
          <span className="text-center font-bold text-lg">Herramientas</span>
          <div className="p-4 m-4 flex flex-col gap-4">
            <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
              <span className="text-center">Tipo de Grafico</span>
              <label>
                <input
                  type="radio"
                  value="line"
                  checked={chartType === "line"}
                  onChange={handleRadioChange}
                />
                Líneas
              </label>
              <label>
                <input
                  type="radio"
                  value="bar"
                  checked={chartType === "bar"}
                  onChange={handleRadioChange}
                />
                Barras
              </label>
              <label>
                <input
                  type="radio"
                  value="pie"
                  checked={chartType === "pie"}
                  onChange={handleRadioChange}
                />
                Pastel
              </label>
            </div>
            {chartType === "line" ? (
              <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
                <span className="text-center">Opciones </span>
                <label>
                  <input
                    type="checkbox"
                    value="Suavizar"
                    checked={suavizar}
                    onChange={cambiarSuavizar}
                  />
                  Suavizar
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="Area"
                    checked={area}
                    onChange={cambiarArea}
                  />
                  Agregar area
                </label>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagistradoTSJ;
