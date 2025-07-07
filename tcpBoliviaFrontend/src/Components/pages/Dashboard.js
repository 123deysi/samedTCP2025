import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles/dashboard.css';
import {
  Container, Box, InputAdornment, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, InputLabel, FormControl,
  TablePagination, FormHelperText, IconButton, OutlinedInput
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [formUser, setFormUser] = useState({ name: '', email: '', password: '', role_id: '' });
  const [errors, setErrors] = useState({ name: false, email: false, password: false, role_id: false });
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!token) {
      navigate('/login');
      return;
    }

    setUser(storedUser);
    const config = { headers: { Authorization: `Bearer ${token}` } };

    axios.get('http://localhost:8000/api/roles', config)
      .then(res => setRoles(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:8000/api/users', config)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser({ ...formUser, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const openAddModal = () => {
    setFormUser({ name: '', email: '', password: '', role_id: '' });
    setErrors({ name: false, email: false, password: false, role_id: false });
    setEditMode(false);
    setOpenModal(true);
  };

  const openEditModal = (user) => {
    setFormUser({ ...user, password: '' });
    setErrors({ name: false, email: false, password: false, role_id: false });
    setEditMode(true);
    setOpenModal(true);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: !formUser.name.trim(),
      email: !formUser.email || !/\S+@\S+\.\S+/.test(formUser.email),
      password: !editMode && (!formUser.password || formUser.password.length < 8),
      role_id: !formUser.role_id,
    };
    
    
    // Validar si el correo ya existe en otro usuario (al agregar o editar)
  const emailExists = users.some(user => 
    user.email === formUser.email && user.id !== formUser.id
  );

  if (emailExists) {
    newErrors.email = true;
    valid = false;
  }

    setErrors(newErrors);
    return Object.values(newErrors).every(err => err === false);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (editMode) {
      const dataToSend = { ...formUser };
      if (!dataToSend.password.trim()) {
        delete dataToSend.password;
      }

      axios.put(`http://localhost:8000/api/users/${formUser.id}`, dataToSend, config)
        .then(res => {
          const userRole = roles.find(r => r.id === parseInt(formUser.role_id));
          const updated = { ...res.data.user, role: userRole };
          setUsers(users.map(u => u.id === formUser.id ? updated : u));
          setOpenModal(false);

          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            showConfirmButton: false,
            timer: 2000
          });
        })
        .catch(err => {
          Swal.fire({ 
            icon: 'error',
            title: 'Error al actualizar',
            text: err.response?.data?.message || err.message,
          });
        });
    } else {
      axios.post('http://localhost:8000/api/register', formUser, config)
        .then(res => {
          const userRole = roles.find(r => r.id === parseInt(formUser.role_id));
          const newUser = { ...res.data.user, role: userRole };
          setUsers([...users, newUser]);
          setOpenModal(false);

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            showConfirmButton: false,
            timer: 800
          });
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Error al agregar',
            text: err.response?.data?.message || err.message,
          });
        });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        axios.delete(`http://localhost:8000/api/users/${id}`, config)
          .then(() => {
            setUsers(users.filter(u => u.id !== id));

            Swal.fire({
              icon: 'success',
              title: 'Usuario eliminado',
              showConfirmButton: false,
              timer: 800
            });
          })
          .catch(err => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: err.message,
            });
          });
      }
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.role?.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <br />
      <br />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
  onClick={openAddModal}
  startIcon={<AddIcon />}
  sx={{
    backgroundColor: '#7B1E3A',
    color: '#fff',
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '0.875rem',
    paddingY: 1,
    paddingX: 2.5,
    minHeight: '36px',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#5e162c',
    },
  }}
>
  Agregar Usuario
</Button>


        <OutlinedInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Buscar usuarios..."
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          }
          sx={{
  width: 300,
  height: 37,
  borderRadius: '10px',
  backgroundColor: '#ffff', 
 
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#a9c9ff',  // borde azul clarito
    borderWidth: 1.2,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#90b0ff', // borde un poco más saturado al hover
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#a9c0ff', // mismo tono suave al focus para no cambiar mucho
    borderWidth: 1.5,
  },
  '& .MuiInputBase-input': {
    color: '#333',  // texto gris oscuro, no negro puro
      fontSize: '0.85rem', 
  },
}}

          endAdornment={
            searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchQuery('')}
                  edge="end"
                  size="small"
                  aria-label="clear search"
                >
                  ✕
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </Box>

      <TableContainer component={Paper} style={{ marginTop: 20 }} className="shadow-lg">
        <Table>
          <TableHead>
            <TableRow className='sidebar-gradient'>
              <TableCell className="text-white">Nombre</TableCell>
              <TableCell className="text-white">Correo</TableCell>
              <TableCell className="text-white">Rol</TableCell>
              <TableCell className="text-white" align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role?.role || ''}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => openEditModal(user)}
                    variant="outlined"
                    color="warning"
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ mr: 1, borderRadius: '25px', textTransform: 'none' }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(user.id)}
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    sx={{ borderRadius: '25px', textTransform: 'none' }}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    <TablePagination
  component="div"
  count={filteredUsers.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  rowsPerPageOptions={[5, 10, 25]}
  labelRowsPerPage="Filas por página:"
  labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
  sx={{
    mt: 2,
    backgroundColor: '#f9f9f9',
    borderTop: '1px solid #ddd',
    borderRadius: '0 0 12px 12px',
  }}
/>



      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editMode ? 'Editar Usuario' : 'Agregar Usuario'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <TextField
              label="Nombre"
              name="name"
              value={formUser.name}
              onChange={handleChange}
              error={errors.name}
              helperText={errors.name ? 'El nombre es obligatorio' : ''}
              fullWidth
              margin="normal"
              autoFocus
            />

            <TextField
              label="Correo"
              name="email"
              value={formUser.email}
              onChange={handleChange}
              error={errors.email}
              helperText={errors.email ? 'Correo inválido o ya existe' : ''}
              fullWidth
              margin="normal"
              type="email"
              
            />

            <TextField
              label={editMode ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
              name="password"
              value={formUser.password}
              onChange={handleChange}
              error={errors.password}
              helperText={errors.password ? 'La contraseña debe tener al menos 8 caracteres' : ''}
              fullWidth
              margin="normal"
              type="password"
              autoComplete="new-password"
            />

            <FormControl
              fullWidth
              margin="normal"
              error={errors.role_id}
            >
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                label="Rol"
                name="role_id"
                value={formUser.role_id}
                onChange={handleChange}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.role}
                  </MenuItem>
                ))}
              </Select>
              {errors.role_id && <FormHelperText>El rol es obligatorio</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenModal(false)}
            color="error"
            variant="outlined"
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '10px', textTransform: 'none' }}
          >
            {editMode ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
