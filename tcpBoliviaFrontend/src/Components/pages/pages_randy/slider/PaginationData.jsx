import React from "react";

const PaginationData = ({ data }) => {
  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg bg-[#DDD]">
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-black uppercase bg-[#DDD] border-b">
          <tr>
            <th scope="col" class="px-6 py-3">
              Fecha
            </th>
            <th scope="col" class="px-6 py-3">
            Tipo de resolucion
            </th>
            <th scope="col" class="px-6 py-3">
              Nro de resolucion
            </th>
            <th scope="col" class="px-6 py-3">
              Departamento
            </th>
            <th scope="col" class="px-6 py-3">
              Sala
            </th>
            <th scope="col" class="px-6 py-3">
              Accion
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} class="border-b border-gray-200 text-black bg-white">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {item.fecha_emision}
              </th>
              <td class="px-6 py-4">{item.tipo_resolucion}</td>
              <td class="px-6 py-4">{item.nro_resolucion}</td>
              <td class="px-6 py-4">{item.departamento}</td>
              <td class="px-6 py-4">{item.sala}</td>
              <td class="px-6 py-4">
                <a
                  href={`http://localhost:3000/Jurisprudencia/Resolucion/${item.id}`}
                  class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Ver resolucion
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginationData;
