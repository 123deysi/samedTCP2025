import React, { useEffect, useState } from "react";
import "../../../Styles/Styles_randy/mapa.css";
import "../../../Styles/Styles_randy/analisis-jurisprudencia.css";
import { departamentos } from "./Mapa";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnalisisMateria = () => {
  const endpoint = "http://localhost:8000/api";

  const [activo, setActivo] = useState(null);

  const [salas, setSalas] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    getAllSalas();
  }, []);

  const getAllSalas = async () => {
    try {
      const response = await axios.get(`${endpoint}/salas`);
      setSalas(response.data.salas);
      setYears(response.data.years);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const [departamento, setDepartamento] = useState("Todos");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSala, setSelectedSala] = useState("");
  const cambiarActivo = (id, name) => {
    setActivo(id);
    setDepartamento(name);
  };
  const cambiarYear = (year) => {
    setSelectedYear(year);
  };
  const cambiarSala = (sala) => {
    setSelectedSala(sala);
  };
  const limpiarMapa = () => {
    setActivo(null);
    setSelectedYear("");
    setSelectedSala("");
    setDepartamento("Todos")
  };

  const navigate = useNavigate();

  const obtenerConteo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${endpoint}/resoluciones`, {
        params: {
          departamento: departamento,
          selectedYear: selectedYear,
          selectedSala: selectedSala,
        },
      });
      console.log(response.data);
      if(response.data.data.length > 0){
        navigate("/Jurisprudencia/Resultados", {
          state: { data: response.data },
        });
      }else{
        alert("No existen datos")
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="py-4 my-4" id="analisis-materia">
      <form onSubmit={obtenerConteo}>
        <h1 className="text-center font-bold text-lg py-4">Opciones</h1>
        <div className="form-juris">
          <div className="subfrom-juris">
            <div>
              <h3 className="text-center">Seleccionar Años</h3>
              <div className="years-col">
                {years.map((year) => {
                  return (
                    <div className="card" key={year}>
                      <input
                        type="radio"
                        value={year}
                        name="year"
                        id={year}
                        checked={selectedYear === year}
                        onChange={() => cambiarYear(year)}
                      />
                      <label htmlFor={year}>
                        <h5>{year}</h5>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-center">Seleccionar Sala</h3>
              <div className="salas-col">
                {salas.map((sala) => {
                  return (
                    <div className="card" key={sala.nombre}>
                      <input
                        type="radio"
                        value={sala.nombre}
                        name="sala"
                        id={sala.nombre}
                        checked={selectedSala === sala.nombre}
                        onChange={() => cambiarSala(sala.nombre)}
                      />
                      <label htmlFor={sala.nombre}>
                        <h5>{sala.nombre}</h5>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <svg
              baseProfile="tiny"
              fill="#6f9c76"
              id="svg_bolivia"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth=".5"
              version="1.2"
              viewbox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="features">
                {departamentos.map((departamento, index) => {
                  return (
                    <path
                      key={departamento.id}
                      d={departamento.d}
                      id={departamento.id}
                      name={departamento.name}
                      className={` ${
                        activo === departamento.id ? "activo" : ""
                      }`}
                      onClick={() =>
                        cambiarActivo(departamento.id, departamento.name)
                      }
                    ></path>
                  );
                })}
              </g>
              <g id="points">
                <circle
                  className="-22.23638588765449|-69.05645068916371"
                  cx="138.5"
                  cy="907.4"
                  id="0"
                ></circle>
                <circle
                  className="-16.94941142777493|-62.95603494700188"
                  cx="540.2"
                  cy="537.7"
                  id="1"
                ></circle>
                <circle
                  className="-10.34069335292549|-58.07570235327242"
                  cx="861.5"
                  cy="89.6"
                  id="2"
                ></circle>
              </g>
              <g id="label_points">
                <circle
                  className="La Paz"
                  cx="196.4"
                  cy="443.6"
                  id="BOL"
                ></circle>
                <circle
                  className="Oruro"
                  cx="226.1"
                  cy="663.5"
                  id="BOO"
                ></circle>
                <circle
                  className="Potosí"
                  cx="282.5"
                  cy="805.4"
                  id="BOP"
                ></circle>
                <circle
                  className="Tarija"
                  cx="481.2"
                  cy="855.3"
                  id="BOT"
                ></circle>
                <circle
                  className="Santa Cruz"
                  cx="607.2"
                  cy="577"
                  id="BOS"
                ></circle>
                <circle
                  className="Chuquisaca"
                  cx="449"
                  cy="770.1"
                  id="BOH"
                ></circle>
                <circle className="Pando" cx="249" cy="152.4" id="BON"></circle>
                <circle
                  className="El Beni"
                  cx="376.9"
                  cy="328.7"
                  id="BOB"
                ></circle>
                <circle
                  className="Cochabamba"
                  cx="372.7"
                  cy="555.3"
                  id="BOC"
                ></circle>
              </g>
            </svg>
          </div>
        </div>
        <div className="flex justify-end">
          <div>
            <button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700 p-3 m-4 rounded-lg"
            >
              Generar
            </button>
            <button
              type="button"
              onClick={() => limpiarMapa()}
              className="bg-green-600 text-white hover:bg-green-700 p-3 m-4 rounded-lg"
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalisisMateria;
