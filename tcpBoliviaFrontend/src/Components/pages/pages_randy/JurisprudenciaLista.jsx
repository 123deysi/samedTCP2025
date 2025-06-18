import React from "react";
import { Link } from "react-router-dom";

const JurisprudenciaLista = () => {
  const jurisprudenciaItems = [
    {
      id: 1,
      title: "Analisis por materia",
      descripcion: "Quis commodo deserunt pariatur eu ea ut.",
      path: "/Jurisprudencia/Analisis-Materia",
      cName: "tool-item",
      color: "f86c6b",
    },
    {
      id: 2,
      title: "Analisis por magistrados",
      descripcion:
        "Commodo fugiat sint Lorem minim tempor cupidatat enim adipisicing.",
      path: "/Jurisprudencia/Analisis-Magistrados",
      cName: "tool-item",
      color: "ffc107",
    },
  ];
  const styles = {
    page: {
      height: "85vh",
    },
  };
  return (
    <div className="lista-analisis" style={styles.page}>
      <div className="p-4 my-4 mx-40 flex  flex-col flex-wrap gap-4">
        <div className="p-4 flex justify-center">
          <span className="font-bold text-center text-lg">
            Lista de Analisis
          </span>
        </div>
        {jurisprudenciaItems.map((item) => (
          <Link to={item.path} key={item.id}>
            <div
              key={item.id}
              className="p-4 rounded-lg bg-slate-200 hover:cursor-pointer hover:bg-slate-700 hover:text-white"
            >
              <span className="font-bold"> {item.title}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JurisprudenciaLista;
