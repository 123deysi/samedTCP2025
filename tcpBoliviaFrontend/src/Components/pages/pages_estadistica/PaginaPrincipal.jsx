// src/Components/pages/pages_estadistica/PaginaPrincipal.jsx
import React, { useState } from "react";
import IndividualCases from "./pages_filtro/IndividualCases";
import IndividualResolutions from "./pages_filtro/IndividualResolutions";
import MultipleSelection from "./pages_filtro/MultipleSelection";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';

const PaginaPrincipal = () => {
  const [selectedFilter, setSelectedFilter] = useState("");

  // Función para manejar la selección del radio button
  const handleRadioChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/Inicio');
  };

  return (
    
      <div className="contenedor_principal">
        <div className="navbar2">
          <div className="navbar-title">
            <div className="navbar-icon1">
              <i className="fa fa-filter" aria-hidden="true"></i>
            </div>
            <h1 className="fw-bold mb-0">Explorar filtros de causas y resoluciones</h1>
          </div>    
        </div>
        {/* Opciones de selección */}
        <div className="d-flex flex-wrap justify-content-between align-items-left mt-5 filtros-container">
          <div>
            <h4 className="fw-bold mt-2">Seleccionar modalidad:</h4>
          </div>

          <div className="d-flex flex-wrap gap-3 ms-auto checkbox-container">
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="tipo de gráfico"
                name="tipo-grafico"
                value={selectedFilter}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="casos"
                  control={<Radio />}
                  label="Causas: Análisis univariable"
                />
                <FormControlLabel
                  value="resoluciones"
                  control={<Radio />}
                  label="Resoluciones: Análisis univariable"
                />
                <FormControlLabel
                  value="multiple"
                  control={<Radio />}
                  label="Causas y Resoluciones: Análisis multivariable"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        {/* Contenedor centrado si no hay selección */}
        {selectedFilter === "" && (
          <div
            className="d-flex justify-content-center align-items-center text-center"
            style={{ width: "100%", height: "400px" }}
          >
            <p className="fw-bold fs-5" style={{ width: "100%" }}>
              Selecciona un tipo de gráfico para continuar
            </p>
          </div>
        )}

        {/* Renderizar el componente correspondiente */}
        {selectedFilter === "casos" && <IndividualCases />}
        {selectedFilter === "resoluciones" && <IndividualResolutions />}
        {selectedFilter === "multiple" && <MultipleSelection />}
      </div>
    
  );
};

export default PaginaPrincipal;
