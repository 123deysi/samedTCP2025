import React from "react";


import "../../../Styles/Styles_estadisticas/botonLibroCodigo.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons"; // Ícono de descarga

const BotonLibroDeCodigo = () => {
  const googleDriveLink = "https://drive.google.com/uc?export=download&id=TU_ID_AQUI";

  return (
    <a
      href={googleDriveLink}
      className="boton-libro-de-codigo"
      target="_blank"
      rel="noopener noreferrer"
      title="Descargar libro de código"
    >
      <FontAwesomeIcon icon={faDownload} className="icono-descarga" />
      Libro de Código
    </a>
  );
};

export default BotonLibroDeCodigo;
