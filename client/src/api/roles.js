import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configurar interceptor para incluir token en todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const rolesApi = {
  // Obtener todos los roles
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      // Mapear la estructura del backend a la esperada por el frontend
      const roles = response.data.data || response.data;
      return roles.map(role => ({
        id: role.role_id,
        name: role.role_name
      }));
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  },

  // Crear un nuevo rol
  create: async (roleData) => {
    try {
      // Mapear al formato esperado por el backend
      const backendData = {
        role_name: roleData.name
      };
      const response = await axios.post(`${API_URL}/roles`, backendData);
      const role = response.data.data || response.data;
      return {
        id: role.role_id,
        name: role.role_name
      };
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw error;
    }
  },

  // Obtener un rol por ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/roles/${id}`);
      const role = response.data.data || response.data;
      return {
        id: role.role_id,
        name: role.role_name
      };
    } catch (error) {
      console.error('Error al obtener rol:', error);
      throw error;
    }
  },

  // Actualizar un rol
  update: async (id, roleData) => {
    try {
      const backendData = {
        role_name: roleData.name
      };
      const response = await axios.put(`${API_URL}/roles/${id}`, backendData);
      const role = response.data.data || response.data;
      return {
        id: role.role_id,
        name: role.role_name
      };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  },

  // Eliminar un rol
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/roles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      throw error;
    }
  }
};
