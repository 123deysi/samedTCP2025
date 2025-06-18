// src/Components/FormularioResolucion.jsx
import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

function FormularioResolucion() {
  const [resolucion, setResolucion] = useState({
    numres: '',
    numres2: '',
    fecha: '',
    res_mes: '',
    res_tipo_id: '',
    res_tipo2_id: '',
    res_fondo: '',   
    disprin_id: '',
    resresul: '',
    revresul: '',
    resfinal: '',
    relator: ''
    });
  const handleChangeResolucion = (e) => {
    const { name, value } = e.target;
    setResolucion(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitResolucion = (e) => {
    e.preventDefault();
    console.log('Resolución enviada:', resolucion);
    //  añadir la lógica para enviar el formulario a tu servidor o API
  };

  return (
    <form onSubmit={handleSubmitResolucion}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de Resolución"
            name="numres"
            value={resolucion.numres}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de Resolución2"
            name="numres2"
            value={resolucion.numres2}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Fecha"
            name="fecha"
            type="date"
            value={resolucion.fecha}
            onChange={handleChangeResolucion}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Mes de Resolución"
            name="res_mes"
            type="number"
            value={resolucion.res_mes}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tipo de Resolución ID"
            name="res_tipo_id"
            type="number"
            value={resolucion.res_tipo_id}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tipo de Resolución 2 ID"
            name="res_tipo2_id"
            type="number"
            value={resolucion.res_tipo2_id}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Resolución de Fondo"
            name="res_fondo"
            value={resolucion.res_fondo}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Disposición Principal ID"
            name="disprin_id"
            type="number"
            value={resolucion.disprin_id}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Resultado de Resolución"
            name="resresul"
            value={resolucion.resresul}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Revisión de Resultado"
            name="revresul"
            value={resolucion.revresul}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Resultado Final"
            name="resfinal"
            value={resolucion.resfinal}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Relator"
            name="relator"
            value={resolucion.relator}
            onChange={handleChangeResolucion}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Agregar Resolución
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormularioResolucion;
