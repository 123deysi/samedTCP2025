import React from 'react';
import { Routes, Route } from 'react-router-dom';

import FormularioCaso from './FormularioCaso';
import FormularioResolucion from './FormularioResolucion';

const Formulario = () => {
  return (
    <>
    <FormularioCaso/>
    <FormularioResolucion/>
     
    </>
  );
};

export default Formulario;
