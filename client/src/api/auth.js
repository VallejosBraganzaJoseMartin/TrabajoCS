import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const authApi = {
  // Registro de usuarios
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error en el registro:', error);
      throw error;
    }
  },

  // Login de usuarios
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  },

  // Logout de usuarios
  logout: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error en el logout:', error);
      throw error;
    }
  },

  // Obtener datos del usuario actual
  getCurrentUser: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      throw error;
    }
  }
};
