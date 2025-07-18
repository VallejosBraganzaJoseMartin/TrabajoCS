import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const userData = await authApi.getCurrentUser(token);
          setUser(userData);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          // Si hay error al obtener los datos, limpiar el token
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [token]);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
