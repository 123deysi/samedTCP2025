import React from 'react';
import TableTemplate from './Table/TableTemplate';
import Table7 from './Table/Table7';

const RenderTable = ({ currentChart, chartData }) => {
  const chartConfig = {
    chart1: {
      headers: ['Departamento', 'Cantidad de Casos'],
      th1: 'Departamento',
      th2: 'Cantidad de Casos',
    },
    chart2: {
      headers: ['Municipio', 'Cantidad de Casos'],
      th1: 'Municipio',
      th2: 'Cantidad de Casos',
    },
    chart3: {
      headers: ['Departamento-Tipo Resolución- Subtipo Resolución', 'Cantidad de Resoluciones'],
      th1: 'Departamento - Tipo Resolución - Subtipo Resolución',
      th2: 'Cantidad de Resoluciones',
    },
    chart4: {
      headers: ['Mes', 'Cantidad de Resoluciones'],
      th1: 'Res Fondo Voto',
      th2: 'Cantidad de Resoluciones',
    },
    chart5: {
      headers: ['Tipo de Acción Constitucional - Subtipo Acción Constitucional', 'Cantidad de Resoluciones'],
      th1: 'Acción Constitucional 2 - Acción Constitucional',
      th2: 'Cantidad de Resoluciones',
    },
    chart6: {
      headers: ['Emisor de Resolución', 'Cantidad de Casos'],
      th1: 'Emisor de Resolución',
      th2: 'Cantidad de Casos',
    },
    chart7: {
      headers: ['Año - Mes', ...chartData.datasets.map(dataset => dataset.label), 'Total'],
      isTable7: true,
    },
    chart8: {
      headers: ['Res Fondo Voto', 'Cantidad de Resoluciones'],
      th1: 'Res Fondo Voto',
      th2: 'Cantidad de Resoluciones',
    },
    chart9: {
      headers: ['Relator', 'Cantidad de Casos'],
      th1: 'Relator',
      th2: 'Cantidad de Casos',
    },
  };

  const config = chartConfig[currentChart];

  if (config) {
    if (config.isTable7) {
      return <Table7 headers={config.headers} chartData={chartData} />;
    }

    return (
      <TableTemplate
        headers={config.headers}
        chartData={chartData}
        th1={config.th1}
        th2={config.th2}
        currentChart={currentChart}
      />
    );
  }
};

export default RenderTable;
