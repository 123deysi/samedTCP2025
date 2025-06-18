import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../Styles/Styles_randy/analisis-magistrados.css";
import { useNavigate } from "react-router-dom";

const AnalisisMagistrados = () => {

  const endpoint = "http://localhost:8000/api";
  const [activo, setActivo] = useState(null);
  const navigate = useNavigate();
  const [magistrados, setMagistrados] = useState([]);
  const [selectedMagistrado, setSelectedMagistrado] = useState(1);
  const cambiarMagistrado = (item) => {
    setSelectedMagistrado(item.id);
    console.log(item.nombre);
  };
  useEffect(() => {
    getAllMagistrados();
  }, []);

  const limpiarFiltros = () => {
    setSelectedMagistrado(1);
  }
  const getAllMagistrados = async () => {
    try {
      const response = await axios.get(`${endpoint}/magistrados`);
      console.log(response.data);
      setMagistrados(response.data.magistrados);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const navegar = () => {
    if (selectedMagistrado) {
        navigate(`/Jurisprudencia/Magistrado/${selectedMagistrado}`);
    } else {
        alert("Por favor seleccione un magistrado.");
    }
};

  return (
    <div id="magistrados-analisis" className="p-4 m-4">
      <div className="flex justify-center">
        <span className="text-center font-bold text-2xl p-4">
          Lista de magistrados
        </span>
      </div>
      <div className="magistrados-col">
        {magistrados.map((item) => {
          return (
            <div className="card" key={item.id}>
              <input
                type="radio"
                value={item.nombre}
                name="magistrado"
                id={item.nombre}
                checked={selectedMagistrado === item.id}
                onChange={() => cambiarMagistrado(item)}
              />
              <label htmlFor={item.nombre}>
                <h5>{item.nombre}</h5>
              </label>
            </div>
          );
        })}
      </div>
      <div className="btn-container flex flex-row gap-4 justify-end">
        <button className="bg-blue-500 text-white text-center p-3 rounded-lg hover:bg-blue-800" onClick={navegar}>Generar</button>
        <button className="bg-blue-500 text-white text-center p-3 rounded-lg hover:bg-blue-800" onClick={limpiarFiltros}>Limpiar</button>
      </div>
    </div>
  );
};

export default AnalisisMagistrados;
