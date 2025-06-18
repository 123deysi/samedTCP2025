import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CerrarLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simula el proceso de cierre de sesión aquí
    // Por ejemplo, puedes eliminar el token de autenticación o hacer una solicitud a la API
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirige a la página de login después de cerrar sesión
    navigate('/login'); // Cambia '/login' por la ruta correcta a tu página de login
  }, [navigate]);

  return (
    <div>
        <h1>Cerrando sesión...</h1>
    </div>
  );
}

export default CerrarLogin;
