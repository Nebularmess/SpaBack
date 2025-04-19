import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext(null);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si el usuario ya está autenticado (al cargar la aplicación)
  useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');
    const clienteNombre = localStorage.getItem('clienteNombre');
    
    // Verificación de datos obtenidos del localStorage
    console.log('clienteId desde localStorage:', clienteId);  // Asegúrate de que este valor esté presente
    console.log('clienteNombre desde localStorage:', clienteNombre);  // Asegúrate de que este valor esté presente

    if (clienteId && clienteNombre) {
      setUser({
        id_cliente: clienteId,
        nombre: clienteNombre
      });
    }
    
    setLoading(false);
  }, []);

  // Función de login
// src/contexts/AuthContext.js
// …
const login = (userData) => {
  // si el objeto trae .id_cliente lo usamos, si no usamos .id
  const id = userData.id_cliente ?? userData.id;
  const nombre = userData.nombre;

  localStorage.setItem('clienteId', id);
  localStorage.setItem('clienteNombre', nombre);

  // dejamos el estado uniformizado bajo la propiedad id_cliente
  setUser({ id_cliente: id, nombre });
};
// …


  // Función de logout
  const logout = () => {
    localStorage.removeItem('clienteId');
    localStorage.removeItem('clienteNombre');
    setUser(null);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  // Valores que expondremos a través del contexto
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
