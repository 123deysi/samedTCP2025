import React from 'react'; 
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Aquí va tu sidebar */}
      <Sidebar className="sidebar" />
      
      {/* Contenido principal donde se renderizan las rutas */}
      <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto' }}>
        <Outlet /> {/* Aquí se renderizan los componentes correspondientes a las rutas */}
      </div>
    </div>
  );
};

export default AdminLayout;
