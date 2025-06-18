import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../../Components/Loading";
import "../../../Styles/Styles_randy/cronologia-jurisprudencia.css";
import { useNavigate } from "react-router-dom";
const endpoint = "http://localhost:8000/api";
const ShowTemas = () => {
  const navigate = useNavigate();

  const [temas, setTemas] = useState(null);
  const [currentTema, setCurrentTema] = useState(null);

  const [arbol, setArbol] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (arbol.length > 0) {
      setCurrentSlide(1);
      getParams();
      console.log("next");
    } else {
      alert("Debe seleccionar una materia");
    }
  };

  const prevSlide = () => {
    setCurrentSlide(0);
    console.log("prev");
  };

  useEffect(() => {
    getAllTemas();
  }, []);

  const setActivo = (id) => {
    if (currentTema === id) {
      setCurrentTema(null);
    } else {
      setCurrentTema(null);
      setTemas(null);
      getAllHijos(id);
      const nombre = temas.find((tema) => tema.id === id)?.nombre;

      const nuevoArbol = [...arbol, { id: id, nombre: nombre }];
      setArbol(nuevoArbol);
    }
  };

  const getAllHijos = async (id) => {
    try {
      const response = await axios.get(`${endpoint}/salas-hijos/${id}`);
      setTemas(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const getAllTemas = async () => {
    try {
      const response = await axios.get(`${endpoint}/temas-generales`);
      setTemas(response.data);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };
  const eliminarNodo = (tema) => {
    const index = arbol.indexOf(tema);
    const nuevoArbol = arbol.slice(0, index);
    console.log(nuevoArbol);
    setArbol(nuevoArbol);

    if (nuevoArbol.length <= 0) {
      getAllTemas();
    } else {
      var lastItem = nuevoArbol[nuevoArbol.length - 1];
      getAllHijos(lastItem.id);
    }
  };

  const obtenerCronologia = async (e) => {
    e.preventDefault();
    try {
      const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");
      const response = await axios.get(`${endpoint}/cronologias`, {
        params: {
          tema_id: arbol[arbol.length - 1].id,
          tema_nombre: arbol[arbol.length - 1].nombre,
          descriptor: nombresTemas,
          departamento: selectedDepartamento,
          tipo_resolucion: selectedTipo,
          forma_resolucion: selectedForma,
          fecha_exacta: fechaExacta,
          fecha_desde: fechaDesde,
          fecha_hasta: fechaHasta,
          cantidad: range,
        },
      });
      console.log(response.data);
      if (response.data.length > 0) {
        navigate("/Jurisprudencia/Cronologias/Resultados", {
          state: { data: response.data },
        });
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      const message = error.response.data;
      console.error("Error fetching data:", message);
      alert(message.error);
    }
  };

  const [selectedDepartamento, setSelectedDepartamento] = useState("todos");
  const [selectedForma, setSelectedForma] = useState("Todas");
  const [selectedTipo, setSelectedTipo] = useState("Todas");
  const [fechaExacta, setFechaExacta] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [range, setRange] = useState(10);
  const cambiarTipo = (event) => {
    setSelectedTipo(event.target.value);
  };
  const cambiarForma = (event) => {
    setSelectedForma(event.target.value);
  };

  const cambiarDepartamento = (event) => {
    setSelectedDepartamento(event.target.value);
  };
  const cambiarFechaExacta = (event) => {
    setFechaExacta(event.target.value);
    setFechaDesde("");
    setFechaHasta("");
  };
  const cambiarFechaDesde = (event) => {
    setFechaDesde(event.target.value);
    setFechaExacta("");
  };

  const cambiarRango = (event) => {
    setRange(event.target.value);
  };
  const cambiarFechaHasta = (event) => {
    setFechaHasta(event.target.value);
    setFechaExacta("");
  };

  const limpiarFiltros = () => {
    setSelectedForma("Todas");
    setSelectedTipo("Todas");
    setSelectedDepartamento("Todos");
    setFechaDesde("");
    setFechaExacta("");
    setFechaHasta("");
    setRange(10);
  };
  const [formaResoluciones, setFormaResolucions] = useState([]);
  const [tipoResolucions, setTipoResolucions] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const getParams = async () => {
    try {
      const nombresTemas = arbol.map((tema) => tema.nombre).join(" / ");
      const response = await axios.get(
        `${endpoint}/obtener-parametros-cronologia`,
        {
          params: {
            descriptor: nombresTemas,
          },
        }
      );
      console.log(response.data);
      const { departamentos, forma_resolucions, tipo_resolucions } =
        response.data;

      if (
        departamentos.length > 0 ||
        forma_resolucions.length > 0 ||
        tipo_resolucions.length > 0
      ) {
        setDepartamentos(departamentos);
        setFormaResolucions(forma_resolucions);
        setTipoResolucions(tipo_resolucions);
      } else {
        alert("No existen datos");
      }
    } catch (error) {
      const message = error.response?.data || "Ocurrió un error";
      console.error("Error fetching data:", message);
      alert("Error: " + message.error);
    }
  };

  if (temas === null) {
    return (
      <div className="flex items-center justify-center" style={{ height: 800 }}>
        <Loading />
      </div>
    );
  }

  return (
    <div className="m-4 p-4 custom:p-0 custom:m-0" id="temas-container">
      <div className="header-container">
        <div>
          <p className="text-bold text-3xl text-center my-4">
            Seleccione Materia
          </p>
          <div className="flex flex-row gap-1 flex-wrap arrow-steps clearfix my-4">
            {arbol.map((tema, index) => (
              <div
                className={`step  hover:cursor-pointer hover:bg-red-500 hover:text-white custom:text-xs ${
                  tema.id === arbol[arbol.length - 1].id ? "current" : ""
                }`}
                key={tema.id}
                id={tema.id}
                onClick={() => eliminarNodo(tema)}
              >
                {tema.nombre}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="slider-container">
        <div className={`slide ${currentSlide === 0 ? "current" : ""}`}>
          {temas.map((tema) => (
            <div
              className="p-4 text-white  custom:text-xs text-center rounded-lg materia-div bg-green-400 hover:bg-green-700 hover:cursor-pointer"
              key={tema.id}
              id={tema.id}
              onClick={() => setActivo(tema.id)}
            >
              {tema.nombre}
            </div>
          ))}
        </div>
        <div
          className={`slide second-slide ${
            currentSlide === 1 ? "current" : ""
          }`}
        >
          <div className=" bg-neutral-100">
            <div className="text-b font-bold text-lg text-center rounded-t-lg">
              <p>Campos de Filtrado</p>
            </div>
            <div className="p-4 m-4">
              <div className="grid grid-row-2 gap-4">
                <div className="row-select">
                  <div className="select-form">
                    <p>Departamentos:</p>
                    <select
                      value={selectedDepartamento}
                      className="form-control"
                      onChange={cambiarDepartamento}
                    >
                      <option value="todos">Todos</option>
                      {departamentos.map((item, index) => (
                        <option value={item} key={index}>
                          {item}{" "}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="select-form">
                    <p>Forma de Resolucion</p>
                    <select
                      className="form-control"
                      onChange={cambiarForma}
                      value={selectedForma}
                    >
                      <option value="todas">Todas</option>
                      {formaResoluciones.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="select-form">
                    <p>Tipo de resoluciones</p>
                    <select
                      className="form-control"
                      onChange={cambiarTipo}
                      value={selectedTipo}
                    >
                      <option value="todas">Todas</option>
                      {tipoResolucions.map((item, index) => (
                        <option value={item} key={index}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row-select">
                  <div className="select-form">
                    <p>Fecha Exacta</p>
                    <input
                      value={fechaExacta}
                      className="form-control"
                      type="date"
                      onChange={cambiarFechaExacta}
                    ></input>
                  </div>

                  <div className="select-form">
                    <p>Fecha Desde</p>
                    <input
                      value={fechaDesde}
                      className="form-control"
                      type="date"
                      onChange={cambiarFechaDesde}
                    ></input>
                  </div>

                  <div className="select-form">
                    <p>Fecha Hasta</p>
                    <input
                      value={fechaHasta}
                      className="form-control"
                      type="date"
                      onChange={cambiarFechaHasta}
                    ></input>
                  </div>
                </div>
                <div className="row-select-1">
                  <input
                    id="pi_input"
                    type="range"
                    min="1"
                    max="30"
                    value={range}
                    step="1"
                    onChange={cambiarRango}
                  />
                  <p>
                    Cantidad: <output id="value">{range}</output>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="button-container">
        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
          onClick={prevSlide}
        >
          Anterior
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
          onClick={limpiarFiltros}
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={obtenerCronologia}
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 0 ? "ocultar" : ""
          }`}
        >
          Generar Cronologia
        </button>

        <button
          className={`bg-blue-500 hover:bg-blue-700 p-2 rounded-lg text-white ${
            currentSlide === 1 ? "ocultar" : ""
          }`}
          onClick={nextSlide}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ShowTemas;
