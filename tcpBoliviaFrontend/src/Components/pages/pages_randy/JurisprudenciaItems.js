import { FaChartLine, FaSearch, FaClock } from 'react-icons/fa'; // Importa los iconos que necesitas

export const jurisprudenciaItems = [
  {
    id: 1,
    title: "Analisis",
    path: "/Jurisprudencia/Lista-de-analisis",
    cName: "tool-item",
    icon: <FaChartLine className="icon-style"/> ,
    color: "f86c6b"
  },{
    id: 2,
    title: "Cronologias",
    path: "/Jurisprudencia/Cronologias",
    cName: "tool-item",
    icon: <FaSearch className="icon-style"/> ,
    color: "ffc107"
  },{
    id: 3,
    title: "Busqueda",
    path: "/Jurisprudencia/Busqueda",
    cName: "tool-item",
    icon: <FaClock className="icon-style"/> ,
    color: "4dbd74"
  },
];
