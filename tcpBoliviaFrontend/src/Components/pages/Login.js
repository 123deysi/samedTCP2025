import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../Styles/Styles_administrador/Login.css';

import { URL_API } from '../../Services/EndPoint';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${URL_API}login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }

      const role = user?.role?.role;
      if (role === 'Administrador') {
        navigate('/Administrador/Dashboard');
      } else if (role === 'Auxiliar') {
        navigate('/Administrador/Subir/Excel');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error:', err.message);
      setError(
        err.response?.data?.message || 'Error de conexión. Por favor, intente más tarde.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <img src="logo.png" alt="Logo SAMED TCP" className="login-logo" />
          <h2 className="login-title">Bienvenido a SAMED TCP</h2>
          <p className="login-description">
            Sistema de Administración de Métricas y Estadísticas del Tribunal Constitucional Plurinacional
          </p>
        </div>

        <div className="login-right">
          <h2 className="login-header">Iniciar Sesión</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`form-input ${email ? 'filled' : ''}`}
                autoComplete="username"
              />
              <label htmlFor="email" className="form-floating-label">Correo electrónico</label>
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`form-input ${password ? 'filled' : ''}`}
                autoComplete="current-password"
              />
              <label htmlFor="password" className="form-floating-label">Contraseña</label>

              <label className="inline-flex items-center space-x-2">
                <span>Recordarme</span>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="form-checkbox"
                />
              </label>
            </div>

            <button type="submit" className="form-button">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;