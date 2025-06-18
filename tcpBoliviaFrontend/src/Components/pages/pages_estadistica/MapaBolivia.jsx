import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { departaments } from './MapaBo';
import '../../../Styles/Styles_estadisticas/mapaBo.css';

const MapaBolivia = () => {
  const [hoveredDepto, setHoveredDepto] = useState(null);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Función para obtener los casos por departamento desde Laravel
  const fetchCasosPorDepartamento = async () => {
    try {
      const response = await axios.get('/api/casos');

      const data = response.data;
 console.log(response.data); 
      // Mapear los datos a un formato adecuado para el componente
      const stats = data.reduce((acc, item) => {
        // Encuentra el id del departamento basado en el nombre del departamento
        const depto = departaments.find(depto => depto.name === item.departamento);

        if (depto) {
          const deptoId = depto.id;
        
          //acc[deptoId] = `${Math.round(item.porcentaje)}%`;
          acc[deptoId] = `${item.cantidad_casos}`; 
        }
        return acc;
      }, {});

      setDepartmentStats(stats);
      console.log('Estadísticas finales:', stats);
    } catch (error) {
      console.error('Error fetching casos:', error);
      setDepartmentStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasosPorDepartamento();
  }, []);

  // Datos de acciones constitucionales por departamento
  const accionesConstitucionales = {
    "01": "Acción Constitucional 1",
    "02": "Acción Constitucional 2",
    "03": "Acción Constitucional 3",
    // Agrega más acciones constitucionales según sea necesario
  };

  // Coordenadas para las estadísticas
  const statsCoordinates = {
    "1": { x: "196.4", y: "443.6" },
    "2": { x: "226.1", y: "663.5" },
    "3": { x: "282.5", y: "805.4" },
    "4": { x: "481.2", y: "855.3" },
    "5": { x: "607.2", y: "577" },
    "6": { x: "449", y: "770.1" },
    "7": { x: "249", y: "152.4" },
    "8": { x: "376.9", y: "328.7" },
    "9": { x: "372.7", y: "555.3" },
  };

  return (
    <div className="mapa-container">
      <svg
        baseProfile="tiny"
        fill="#6f9c76"
        id="svg_bolivia"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeLinejoin="round"
        
        strokeWidth=".5"
        version="1.2"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mapa de Bolivia con estadísticas de casos constitucionales"
      >
        <g id="features">
          {departaments.map((departamento) => (
            <g key={departamento.id}>
              <path
                d={departamento.d}
                id={departamento.id}
                className={departamento.activo ? 'activo' : ''}
                onClick={() => console.log(`Departamento clicked: ${departamento.id}`)}
                onMouseOver={() => setHoveredDepto(departamento.id)}
                onMouseOut={() => setHoveredDepto(null)}
                style={{ fill: hoveredDepto === departamento.id ? '#87CEAA' : (departamento.activo ? '#9FDAB6' : '#a7a7a7') }}
              />
              <text
                x={departamento.labelX}
                y={departamento.labelY}
                className="depto-label"
              >
                {departamento.name || ""}
              </text>
            </g>
          ))}
        </g>
        <g id="stats_points">
          {Object.keys(statsCoordinates).map((key) => (
            <text
              key={key}
              x={statsCoordinates[key].x}
              y={statsCoordinates[key].y}
              className="stat-label"
            >
              {departmentStats[key] || "100%"}
            </text>
          ))}
        </g>
      </svg>
      {hoveredDepto && (
        <div className="tooltip">
          <h3>Departamento: {hoveredDepto}</h3>
          <p>{accionesConstitucionales[hoveredDepto] || "No hay datos disponibles"}</p>
          <p><strong>Porcentaje:</strong> {departmentStats[hoveredDepto] || "0%"}</p>
        </div>
      )}
      
    </div>
  );
};

export default MapaBolivia;