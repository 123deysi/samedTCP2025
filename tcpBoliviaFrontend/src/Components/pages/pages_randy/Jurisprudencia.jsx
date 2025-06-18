import React from "react";
import { jurisprudenciaItems } from "./JurisprudenciaItems";
import { Link } from "react-router-dom";
import "../../../Styles/Styles_randy/jurisprudencia.css";
const Jurisprudencia = () => {
  return (
    <main className="main py-4 my-4">
      <div>
        <h2 className="text-center py-4 text-3xl font-bold">Herramientas</h2>
        <div className="cards-container flex p-4 m-4 justify-center items-center custom:flex-col">
          {jurisprudenciaItems.map((item) => {
            return (
              <Link to={item.path} key={item.id}>
                <div className={`card p-4 m-3 bg-${item.color} rounded-md flex flex-col`}>
                  <div
                    id="j-container-icons"
                    className="py-4 flex justify-center items-center"
                  >
                    {item.icon}
                  </div>
                  <p className="text-center text-lg font-bold text-white">{item.title}</p>

                  <p className="p-4 text-xs text-white">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis rerum repudiandae, unde accusamus laboriosam, in tempore voluptas corrupti temporibus fuga, animi veniam quas exercitationem quae odit non dolorem iusto nihil!</p>

                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Jurisprudencia;
