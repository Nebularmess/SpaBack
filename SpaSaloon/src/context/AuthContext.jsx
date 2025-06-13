import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const AuthContext = createContext(null);

// URLs de los endpoints
const API_BASE_URL = 'http://localhost:3001/api';
const ENDPOINTS = {
  cliente: `${API_BASE_URL}/clientes/login`,
  profesional: `${API_BASE_URL}/profesionales/login`
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'cliente' | 'profesional'

  // Verificar si el usuario ya está autenticado (al cargar la aplicación)
  useEffect(() => {
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const storedUserType = localStorage.getItem('userType');
      
      console.log('Datos desde localStorage:', { userId, userName, userType: storedUserType });

      if (userId && userName && storedUserType) {
        setUser({
          id: userId,
          nombre: userName
        });
        setUserType(storedUserType);
      }
    } catch (error) {
      console.error('Error al recuperar datos de la sesión:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Función genérica para hacer login
  const makeLoginRequest = async (endpoint, credentials) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  };

  // Login para clientes
  const loginCliente = async (email, passwd) => {
    try {
      setLoading(true);
      
      const response = await makeLoginRequest(ENDPOINTS.cliente, { email, passwd });
      
      console.log('Respuesta login cliente:', response);

      // Extraer datos del cliente de la respuesta
      const clienteData = response.cliente;
      if (!clienteData) {
        throw new Error('Datos del cliente no encontrados en la respuesta');
      }

      const userId = clienteData.id_cliente || clienteData.id;
      const userName = clienteData.nombre;

      if (!userId || !userName) {
        throw new Error('Datos incompletos del cliente');
      }

      // Guardar en localStorage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userName', userName);
      localStorage.setItem('userType', 'cliente');

      // Actualizar estado
      setUser({ id: userId, nombre: userName });
      setUserType('cliente');

      console.log('Cliente autenticado correctamente:', { id: userId, nombre: userName });
      return { success: true, userType: 'cliente', user: { id: userId, nombre: userName } };

    } catch (error) {
      console.error('Error en login cliente:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login para profesionales
  const loginProfesional = async (email, passwd) => {
    try {
      setLoading(true);
      
      const response = await makeLoginRequest(ENDPOINTS.profesional, { email, passwd });
      
      console.log('Respuesta login profesional:', response);

      // Extraer datos del profesional de la respuesta
      const profesionalData = response.profesional;
      if (!profesionalData) {
        throw new Error('Datos del profesional no encontrados en la respuesta');
      }

      const userId = profesionalData.id_profesional || profesionalData.id;
      const userName = profesionalData.nombre;

      if (!userId || !userName) {
        throw new Error('Datos incompletos del profesional');
      }

      // Guardar en localStorage
      localStorage.setItem('userId', userId.toString());
      localStorage.setItem('userName', userName);
      localStorage.setItem('userType', 'profesional');

      // Actualizar estado
      setUser({ id: userId, nombre: userName });
      setUserType('profesional');

      console.log('Profesional autenticado correctamente:', { id: userId, nombre: userName });
      return { success: true, userType: 'profesional', user: { id: userId, nombre: userName } };

    } catch (error) {
      console.error('Error en login profesional:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userType');
      
      // Limpiar estado
      setUser(null);
      setUserType(null);
      
      console.log('Sesión cerrada correctamente');
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user && !!userType;
  };

  // Verificar si es cliente
  const isCliente = () => {
    return userType === 'cliente';
  };

  // Verificar si es profesional
  const isProfesional = () => {
    return userType === 'profesional';
  };

  // Valores que expondremos a través del contexto
  const value = {
    user,
    userType,
    loading,
    loginCliente,
    loginProfesional,
    logout,
    isAuthenticated,
    isCliente,
    isProfesional
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