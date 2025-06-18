import React from "react";
import "../../Styles/Styles_estadisticas/visorLibro.css";

const VisorLibro = () => {
  return (
    <div className="visor-libro-wrapper">
      <div className="visor-libro-grid">
        {/* Columna izquierda: Descripción */}
        <div className="visor-right">
          <h2 className="visor-title">📘 Libro de Código</h2>
          <p className="visor-description">
            Explora el contenido oficial del <strong>Libro de Código</strong> sobre los datos. Este documento contiene las directrices fundamentales que rigen los procesos y resoluciones, accesible de manera interactiva desde este visor integrado.
          </p>
        </div>

        {/* Columna derecha: Visor PDF */}
        <div className="visor-left">
          <iframe
            src="https://docs.google.com/document/d/1VV7S9Hiz4U9Ii0aG2hQ1tIwQaCdoDrg1r6RmI-4AOvk/preview"
            title="Libro de Código"
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VisorLibro;
