import React, { useState } from 'react';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

function FormularioCaso({
  accionConstitucionalOptions = [],
  departamentoOptions = [],
  municipioOptions = [],
  salaOptions = []
}) {
  const [caso, setCaso] = useState({
    exp: '',
    ref: '',
    accion_constitucional_id: '',
    sala_id: '',
    departamento_id: '',
    municipio_id: '',
    año_codif: '',
    codificador: '',
    observaciones: '',
    fecha_ingreso: ''
  });

  const handleChangeCaso = (e) => {
    const { name, value } = e.target;
    setCaso(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitCaso = (e) => {
    e.preventDefault();
    console.log('Caso enviado:', caso);
    // Aquí puedes añadir la lógica para enviar el formulario a tu servidor o API
  };

  return (
    <form onSubmit={handleSubmitCaso}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Número de Expediente"
            name="exp"
            value={caso.exp}
            onChange={handleChangeCaso}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Referencia"
            name="ref"
            value={caso.ref}
            onChange={handleChangeCaso}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccione Acción Constitucional</InputLabel>
            <Select
              name="accion_constitucional_id"
              value={caso.accion_constitucional_id}
              onChange={handleChangeCaso}
              label="Acción Constitucional"
            >
              {accionConstitucionalOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccione Sala</InputLabel>
            <Select
              name="sala_id"
              value={caso.sala_id}
              onChange={handleChangeCaso}
              label="Sala"
            >
              {salaOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccione Departamento</InputLabel>
            <Select
              name="departamento_id"
              value={caso.departamento_id}
              onChange={handleChangeCaso}
              label="Departamento"
            >
              {departamentoOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Seleccione Municipio</InputLabel>
            <Select
              name="municipio_id"
              value={caso.municipio_id}
              onChange={handleChangeCaso}
              label="Municipio"
            >
              {municipioOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Año de Codificación"
            name="año_codif"
            type="number"
            value={caso.año_codif}
            onChange={handleChangeCaso}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Codificador"
            name="codificador"
            value={caso.codificador}
            onChange={handleChangeCaso}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observaciones"
            name="observaciones"
            value={caso.observaciones}
            onChange={handleChangeCaso}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Fecha de Ingreso"
            name="fecha_ingreso"
            type="date"
            value={caso.fecha_ingreso}
            onChange={handleChangeCaso}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Agregar Caso
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default FormularioCaso;
