import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const MyChartComponent = ({ chartType, labels, counts, title, loading }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [loadingChart, setLoadingChart] = useState(true);

  let getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (!chartType || !title) return;
    const obtenerDatos = async () => {
      setLoadingChart(true);
      let dataColor = getRandomColor();
      try {
        const options = {
          title: {
            text: title,
            left: "center",
            textStyle: {
              fontSize: 14,
              fontWeight: "bold",
              text: "text-wrap",
            },
          },
          tooltip: {
            trigger: chartType === "pie" ? "item" : "axis",
            formatter:
              chartType === "pie" ? "{a} <br/>{b}: {c} ({d}%)" : undefined,
            axisPointer: chartType !== "pie" ? { type: "shadow" } : undefined,
          },
          toolbox: {
            feature: {
              saveAsImage: { show: true },
            },
          },
          series: [],
        };
        if (chartType === "pie") {
          options.series = [
            {
              name: title,
              type: "pie",
              radius: "50%",
              data: labels.map((label, index) => ({
                name: label,
                value: counts[index],
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: dataColor,
                },
              },
            },
          ];
        } else {
          options.xAxis = {
            type: "category",
            data: labels,
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              rotate: 90,
              interval: 0,
            },
          };
          options.yAxis = {
            type: "value",
            name: "Cantidad",
            min: 0,
          };
          options.series = [
            {
              name: title,
              type: chartType,
              data: counts,
              itemStyle: {
                color: dataColor,
              },
            },
          ];
        }
        options.graphic = {
          type: "text",
          left: "center",
          top: "5%",
          style: {
            text: `${title}: ${counts.reduce((acc, curr) => acc + curr, 0)}`,
            fontSize: 11,
            color: dataColor,
          },
        };
        setChartOptions(options);
        setLoadingChart(false);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    obtenerDatos();
  }, [chartType, title]);

  const onChartEvent = {
    restore: () => {
      console.log("El gráfico fue restaurado");
    },
  };

  return loading || loadingChart ? (
    <div className="p-6 pb-16 outline-1 outline rounded-md outline-gray-400 text-3xl text-center h-[500px]">
      Cargando...
    </div>
  ) : (
    <div>
      <div className="w-full max-w-4xl h-[500px] flex justify-self-center shadow-none">
        <ReactECharts
          key={chartType}
          option={chartOptions}
          onEvents={onChartEvent}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
};

export default MyChartComponent;
