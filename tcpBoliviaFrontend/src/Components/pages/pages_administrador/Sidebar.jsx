import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemText, Drawer, Toolbar,
  Typography, useMediaQuery, useTheme, IconButton
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { FaBars, FaUser, FaSignOutAlt } from 'react-icons/fa';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileUploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/ChevronLeft';
import '../../../Styles/Styles_administrador/Sidebar.css';

const sidebarWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(!isMobile);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userRole = storedUser?.role?.role;
  const userName = storedUser?.name;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    navigate('/Administrador/cerrarsesion');
  };

  return (
    <div className="sidebar-container">
      {/* Top Navbar */}
      <div
        className="top-navbar"
        style={{
          left: open && !isMobile ? sidebarWidth : 0,
          width: open && !isMobile ? `calc(100% - ${sidebarWidth}px)` : '100%',
        }}
      >
        {isMobile && (
          <FaBars
            className="navbar-icon"
            onClick={() => setOpen(!open)}
            style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '1rem' }}
          />
        )}

        <div className="user-info">
          <FaUser className="navbar-icon" />
          <span className="user-text">Rol: {userRole} / Usuario: {userName}</span>
        </div>
        <div className="logout-info" onClick={handleLogout}>
          <FaSignOutAlt className="navbar-icon" />
          <span className="logout-text">Cerrar sesión</span>
        </div>
      </div>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: sidebarWidth,
          zIndex: 1302,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarWidth,
            boxSizing: 'border-box',
          },
        }}
        PaperProps={{ className: 'sidebar-gradient' }}
      >
        <Toolbar className="sidebar-toolbar" sx={{ flexDirection: 'column', p: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src="/logo.png" alt="Logo" style={{ width: 80, margin: '0 auto' }} />
              <Typography variant="h6" className="sidebar-title">SAMED TCP</Typography>
            </div>
            {isMobile && (
              <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>

        <List>
          {userRole === 'Administrador' && (
            <>
              <ListItem
                button
                component={Link}
                to="/Administrador/Dashboard"
                className={`sidebar-list-item ${location.pathname === '/Administrador/Dashboard' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <DashboardIcon sx={{ mr: 1 }} className="sidebar-icon" />
                <ListItemText primary="Dashboard" className="white-text" />
              </ListItem>

              <ListItem
                button
                component={Link}
                to="/Administrador/Subir/Excel"
                className={`sidebar-list-item ${location.pathname === '/Administrador/Subir/Excel' ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <FileUploadIcon sx={{ mr: 1 }} className="sidebar-icon" />
                <ListItemText primary="Subir Excel" className="white-text" />
              </ListItem>
            </>
          )}

          {userRole === 'Auxiliar' && (
            <ListItem
              button
              component={Link}
              to="/Administrador/Subir/Excel"
              className={`sidebar-list-item ${location.pathname === '/Administrador/Subir/Excel' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <FileUploadIcon sx={{ mr: 1 }} className="sidebar-icon" />
              <ListItemText primary="Subir Excel" className="white-text" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
