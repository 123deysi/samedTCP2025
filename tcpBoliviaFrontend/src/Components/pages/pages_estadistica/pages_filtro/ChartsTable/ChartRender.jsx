import MyChartComponent from "./MyChartComponent";

const ChartRender = ({ chartType, chartData, currentChart, loading }) => {
  const chartInfo = {
    chart1: {
      title: "Total de las causas reportadas por cada departamento...",
    },
    chart2: {
      title: "Gráfico de casos por municipio.",
    },
    chart3: {
      title: "Cantidad de Resoluciones por Departamento...",
    },
    chart4: {
      title: "Cantidad de Resoluciones por Año y Mes...",
    },
    chart5: {
      title: "Cantidad de Resoluciones por Acción Constitucional...",
    },
    chart6: {
      title: "Cantidad de Casos por ResEmisor...",
    },
    chart7: {
      title: "Cantidad de Casos por Año y mes...",
    },
    chart8: {
      title: "Cantidad de Resoluciones por Fondo Voto:",
      extra: (
        <ul>
          <li>1 = Resolución unánime</li>
          <li>2 = Resolución con disidencia o voto aclaratorio</li>
        </ul>
      ),
    },
    chart9: {
      title: "Cantidad de Resoluciones por Relator:",
    },
  };

  const current = chartInfo[currentChart];
  return (
    <div className="p-6 pb-16 outline-1 outline rounded-md outline-gray-400">
      <MyChartComponent
        currentChart={currentChart}
        chartType={chartType}
        labels={chartData?.labels}
        counts={chartData?.datasets[0]?.data}
        title={chartData?.datasets[0]?.label}
        loading={loading}
      />
      <div className="text-center py-10">
        <p>{current.title}</p>
        {current.extra && <div>{current.extra}</div>}
      </div>
    </div>
  );
};

export default ChartRender;
