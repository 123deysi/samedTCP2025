import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import "../../../Styles/Styles_estadisticas/estadisticas.css";
const Estadisticas = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/contar/casos/resoluciones');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-gray-500">Cargando...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-[90%] mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-600 w-6 h-6" /> 
        Estadísticas Generales
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total de causas */}
        <div className="relative p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full shadow-lg text-sm font-semibold">
            Total de causas
          </div>
          <div className="text-center mt-6">
            <div className="text-4xl font-extrabold text-blue-600">{data.total_casos}</div>
          </div>
        </div>

        {/* Causas resueltas */}
        <div className="relative p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-md">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full shadow-lg text-sm font-semibold">
            Causas resueltas
          </div>
          <div className="text-center mt-6">
            <div className="text-4xl font-extrabold text-green-600">{data.total_resoluciones}</div>
          </div>
        </div>

        {/* Causas pendientes */}
        <div className="relative p-5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-md">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-1 rounded-full shadow-lg text-sm font-semibold">
            Causas pendientes
          </div>
          <div className="text-center mt-6">
            <div className="text-4xl font-extrabold text-orange-600">{data.casos_no_resueltos}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Estadisticas;
