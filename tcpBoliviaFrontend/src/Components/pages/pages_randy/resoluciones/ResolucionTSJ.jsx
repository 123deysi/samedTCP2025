import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../../Loading";
import { IoMdArrowDropdown } from "react-icons/io";
import { TiArrowBack } from "react-icons/ti";
const ResolucionTSJ = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resolucion, setResolucion] = useState(null);
  useEffect(() => {
    const endpoint = `http://localhost:8000/api/resolucion/${id}`;
    const getResolution = async () => {
      try {
        const response = await axios.get(endpoint);
        setResolucion(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
      }
    };
    getResolution();
  }, [id]);

  if (resolucion === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }
  return (
    <div className="bg-[#333333]">
      {
        <div className="flex flex-row-reverse justify-between">
          <div
            className="flex items-center justify-center"
            style={{ width: "100%" }}
          >
            <div
              style={{ width: 800, height: 900 }}
              className="bg-white p-4 m-5 rounded-lg  overflow-y-scroll"
            >
              {resolucion.contenido.split("\r\n").map((line, index) =>
                line === line.toUpperCase() ? (
                  <div className="text-center font-black" key={index}>
                    {line}
                  </div>
                ) : (
                  <div key={index}>{line}</div>
                )
              )}
            </div>
          </div>
          <div className="bg-[#F0F0F0] m-4 " style={{ width: 500 }}>
            <div className="p-4 text-center bg-[#561427] text-white ">
              <p className="flex flex-row gap-4 justify-center items-center">
               
                <button onClick={() => navigate("/Jurisprudencia/Busqueda")} className="hover:text-gray-400"> <TiArrowBack className="text-3xl" /></button>
                Analisis Documental{" "}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 m-4 flex flex-row justify-around">
              {" "}
              <p>Datos Generales</p>
              <IoMdArrowDropdown className="text-2xl" />
            </div>
            <div className=" bg-white p-4 m-4 rounded-lg oculto">
              <p>
                <strong>Nro de Resolucion:</strong> {resolucion.nro_resolucion}
              </p>
              <p>
                <strong>Nro de Expediente:</strong> {resolucion.nro_expediente}
              </p>
              <p>
                <strong>Fecha de Emision:</strong> {resolucion.fecha_emision}
              </p>
              <p>
                <strong>Tipo de Resolucion:</strong>{" "}
                {resolucion.tipo_resolucion}
              </p>
              <p>
                <strong>Departamento:</strong> {resolucion.departamento}
              </p>
              <p>
                <strong>Magistrado:</strong> {resolucion.magistrado}
              </p>
              <p>
                <strong>Forma de Resolucion:</strong>{" "}
                {resolucion.forma_resolucion}
              </p>
              <p>
                <strong>Proceso:</strong> {resolucion.proceso}
              </p>
              <p>
                <strong>Demandante:</strong> {resolucion.demandante}
              </p>
              <p>
                <strong>Demandado:</strong> {resolucion.demandado}
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default ResolucionTSJ;
