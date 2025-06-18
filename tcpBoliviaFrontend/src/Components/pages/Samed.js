import React from "react";
import "../../Styles/Styles_estadisticas/samed.css";
import logo from "../../logo.png";

const Samed = () => {
  return (
    <div className="samed-container">
      <div className="samed-header">
        <img src={logo} alt="Logo Samed" className="samed-logo" />
        <div className="samed-titles">
          <h1>SAMED TCP</h1>
          <h2>Sistema de Almacenamiento de Métricas Estadísticas Dinámicas del Tribunal Constitucinal de Bolivia</h2>
        </div>
      </div>

      <section className="samed-section">
        <h3>📊 ¿Qué es SAMED TCP?</h3>
        <p>
          <strong>SAMED TCP</strong> es una herramienta académica diseñada por el Instituto de Investigaciones Jurídicas y Políticas para el estudio sistemático de la jurisprudencia del Tribunal Constitucional Plurinacional de Bolivia.
           </p>
      </section>

      <section className="samed-section">
        <h3>🎯 Propósito</h3>
        <ul>
          <li>📈 Almacenar y visualizar datos judiciales y políticos.</li>
          <li>🧠 Apoyar investigaciones académicas e institucionales.</li>
          <li>🔍 Fomentar la transparencia y el acceso a la información.</li>
        </ul>
      </section>

      <section className="samed-section">
        <h3>👥 Público Objetivo</h3>
        <ul>
          <li>🎓 Investigadores y estudiantes universitarios.</li>
          <li>⚖️ Profesionales del derecho y las ciencias sociales.</li>
          <li>🗣️ Ciudadanos interesados en políticas públicas.</li>
        </ul>
      </section>
    </div>
  );
};

export default Samed;
