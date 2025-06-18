// authService.js
export const getUserRole = () => {
    // Simula un usuario autenticado. En un entorno real, consulta al backend o usa un token JWT.
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.role || null; // Por ejemplo: 'admin', 'user', etc.
  };
  
  export const isAuthenticated = () => {
    return !!localStorage.getItem('user'); // Comprueba si hay un usuario autenticado
  };
  