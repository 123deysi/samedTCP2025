import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Sidebar from "./Components/pages/pages_administrador/Sidebar";
import Analisis from "./Components/pages/VisorLibro";
import Samed from "./Components/pages/Samed";
import Inicio from "./Components/pages/Inicio";
import VisorLibro from "./Components/pages/VisorLibro";
import Login from "./Components/pages/Login";
import Dashboard from "./Components/pages/Dashboard";
import Jurisprudencia from "./Components/pages/pages_randy/Jurisprudencia";
import JurisprudenciaBusqueda from "./Components/pages/pages_randy/JurisprudenciaBusqueda";
import AnalisisMateria from "./Components/pages/pages_randy/AnalisisMateria";
import JurisprudenciaCronologia from "./Components/pages/pages_randy/JurisprudenciaCronologia";
import ResultadoAnalisis from "./Components/pages/pages_randy/ResultadoAnalisis";
import ResolucionTSJ from "./Components/pages/pages_randy/resoluciones/ResolucionTSJ";
import CronologiasResultados from "./Components/pages/pages_randy/CronologiasResultados";
import JurisprudenciaLista from "./Components/pages/pages_randy/JurisprudenciaLista";
import AnalisisMagistrados from "./Components/pages/pages_randy/AnalisisMagistrados";
import MagistradoTSJ from "./Components/pages/pages_randy/magistrados/MagistradoTSJ";


import AdminLayout from "./Components/pages/pages_administrador/AdminLayout";
import FormularioCaso from "./Components/pages/pages_administrador/FormularioCaso";
import FormularioResolucion from "./Components/pages/pages_administrador/FormularioResolucion";
import Formulario from "./Components/pages/pages_administrador/Formulario";
import FormularioExcel from "./Components/pages/pages_administrador/FormularioExcel";
import BusquedaSimple from "./Components/pages/pages_estadistica/BusquedaSimple";
import { ThemeProvider } from "./Components/ThemeProvider";
import CerrarLogin from './Components/pages/CerrarLogin';
import PaginaPrincipal from './Components/pages/pages_estadistica/PaginaPrincipal';
//import PaginaFiltro from './Components/pages/pages_estadistica/pages_filtro/PaginaFiltro';

import PaginaFiltros2 from './Components/pages/pages_estadistica/PaginaFiltros2';

// filter
import PageFilter from './Components/pages/pages_estadistica/pages_filtro/PageFilter';

import Filters from './Components/pages/pages_estadistica/pages_filtro/Filters'

function App() {
  const location = useLocation();
  const noNavbarRoutes = ['/Jurisprudencia/Resolucion/:id'];
  const noFooterRoutes = ['/Jurisprudencia/Resolucion/:id', '/Jurisprudencia/Busqueda', '/Jurisprudencia/Cronologias'];
  const isAdminRoute = location.pathname.startsWith('/Administrador');

  const shouldShowNavbar = !noNavbarRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );

  const shouldShowFooter = !noFooterRoutes.some((route) =>
    location.pathname.match(new RegExp(`^${route.replace(':id', '\\d+')}$`))
  );
  return (
    <ThemeProvider>
      <main>
        {shouldShowNavbar && !isAdminRoute && <Navbar />}
        {isAdminRoute && <Sidebar />}
        <Routes>
          <Route path="/" element={<Navigate to="/Inicio" />} />
          <Route path="/Analisis" element={<Analisis />} />
          <Route path="/Inicio" element={<Inicio />} />
          <Route path="/Sobre" element={<Samed />} />
          <Route path="/Libro-codigo" element={<VisorLibro />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />

          <Route path="/Jurisprudencia" element={<Jurisprudencia />} />
          <Route path="/Jurisprudencia/Analisis-Materia" element={<AnalisisMateria />} />
          <Route path="/Jurisprudencia/Analisis-Magistrados" element={<AnalisisMagistrados />} />
          <Route path="/Jurisprudencia/Lista-de-analisis" element={<JurisprudenciaLista />} />
          <Route path="/Jurisprudencia/Resultados" element={<ResultadoAnalisis />} />
          <Route path="/Jurisprudencia/Busqueda" element={<JurisprudenciaBusqueda />} />
          <Route path="/Jurisprudencia/Cronologias" element={<JurisprudenciaCronologia />} />
          <Route path="/Jurisprudencia/Magistrado/:id" element={<MagistradoTSJ />} />
          <Route path="/Jurisprudencia/Resolucion/:id" element={<ResolucionTSJ />} />
          <Route path="/Jurisprudencia/Cronologias/Resultados" element={<CronologiasResultados />} />

          <Route path="/Dinamicas/Busqueda/Simple" element={<BusquedaSimple />} />
          <Route path="/Formulario/Datos" element={<FormularioCaso />} />
          <Route path="/Formulario/Casos" element={<FormularioCaso />} />
          <Route path="/Formulario/Resoluciones" element={<FormularioResolucion />} />
          <Route path="/Subir/Excel" element={<FormularioExcel />} />
          
          <Route path="/Dinamicas" element={<PaginaPrincipal />} />
         
          <Route path="/Dinamicas/filter" element={<Filters />} />
          <Route path="/Dinamicas/Filtro2" element={<PaginaFiltros2 />} />
          
          
          <Route path="/Administrador" element={<AdminLayout />}>
            <Route path="Dashboard" element={<Dashboard />} />
            <Route path="Formulario/Casos" element={<FormularioCaso />} />
            <Route path="Formulario/Resoluciones" element={<FormularioResolucion />} />
            <Route path="Formulario" element={<Formulario />} />
            <Route path="Subir/Excel" element={<FormularioExcel />} />
            <Route path="cerrarsesion" element={<CerrarLogin />} />
          </Route>
        </Routes>
        {shouldShowFooter && !isAdminRoute && <Footer />}
      </main>
    </ThemeProvider>
  );
}

export default App;
