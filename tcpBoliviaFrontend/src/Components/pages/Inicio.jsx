import React from 'react';
import html2canvas from 'html2canvas';
import { TrendingUp } from "lucide-react";

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faArrowLeft,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

import "../../Styles/Styles_estadisticas/Inicio.css";
import "../../Styles/Styles_estadisticas/GraficoEchart.css";
import "../../Styles/Styles_estadisticas/Grafico.css";

import EChart from "./pages_estadistica/EChart";
import Estadisticas from "./pages_estadistica/Estadisticas";
import GraficoCasos from "./pages_estadistica/GraficoCasos";
import MapaBolivia from "./pages_estadistica/MapaBolivia";
import Descargas from "./pages_estadistica/Desgargas";
import BotonLibroDeCodigo from "./pages_estadistica/BotonLibroDeCodigo";


const Inicio = () => {
  const handleDownloadEstadisticas = () => {
    const input = document.getElementById('estadisticas-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'estadisticas.png';
        link.click();
      });
    }
  };

  const handleDownloadGraficoCasos = () => {
    const input = document.getElementById('grafico-casos-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'grafico_casos.png';
        link.click();
      });
    }
  };

  const handleDownloadEChart = () => {
    const input = document.getElementById('echart-container');
    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'echart.png';
        link.click();
      });
    }
  };

  const navigate = useNavigate();

  const handleFilterClick = () => {
    navigate('/Dinamicas');
  };

  /*const handleBackClick = () => {
    navigate('/Inicio');
  };*/


  return (
  <>
    <div className="navbar2">
      <div className="navbar-title">
        <div className="navbar-icon1">
          <FontAwesomeIcon icon={faChartLine} style={{ color: "white", fontSize: "18px" }} />
        </div>
        <h1>Panel de Estadísticas</h1>
      </div>

      <div className="navbar-buttons">
        <button className="btn-filter" onClick={handleFilterClick}>
          <FontAwesomeIcon icon={faFilter} />
          <span>Explorar Filtros</span>
        </button>

        {/*<button className="btn-back" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Retroceder</span>
        </button>*/}
      </div>
    </div>

    <div id="contenedor-dinamico-cuadro" className="estadisticas-main">
      <div className="bienvenida">
        <h1>Bienvenido al sistema de análisis jurisprudencial del TCP</h1>
        <p>
          Accede a estadísticas interactivas sobre causas constitucionales y resoluciones del Tribunal 
          Constitucional Plurinacional. Visualiza mapas, gráficos y tendencias en tiempo real.

        </p>
      </div>

     {/* EChart - Primer gráfico */}
<div className="container-grafico px-4 py-4">
  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
    
    Resoluciones Judiciales por Departamento
  </h3>
  <EChart />
</div>

{/* Gráfico de casos - Segundo gráfico */}
<div className="container-grafico-barras px-4 py-4">
  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
   
    Evolución de Causas y Resoluciones por Año
  </h3>
  <GraficoCasos />
</div>

{/* Sección de estadísticas principales */}
<div className="estadisticas-interno px-4 py-4">
  
  <Estadisticas />
</div>


   
    </div>
  </>
);

};
export default Inicio;