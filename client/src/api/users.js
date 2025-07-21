import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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

export const usersApi = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      console.log('Solicitando usuarios al API...');
      const response = await axios.get(`${API_URL}/users`);
      console.log('Respuesta del API:', response.data);
      const users = response.data.data || response.data;
      console.log('Usuarios obtenidos:', users);
      
      if (!Array.isArray(users)) {
        console.warn('No se recibió un array de usuarios');
        return [];
      }

      const mappedUsers = users.map(user => {
        console.log('Mapeando usuario:', user);
        
        const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;
        
        return {
          id: user.user_id,
          firstName: user.user_names,
          lastName: user.user_surenames,
          email: user.user_email,
          isActive: user.user_state,
          roles: user.roles ? user.roles.map(role => ({
            id: role.role_id,
            name: role.role_name,
            description: role.role_descripcion
          })) : [],
          roleId: primaryRole ? primaryRole.role_id : null,
          role: primaryRole ? {
            id: primaryRole.role_id,
            name: primaryRole.role_name,
            description: primaryRole.role_descripcion
          } : null
        };
      });
      
      console.log('Usuarios mapeados:', mappedUsers);
      return mappedUsers;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      console.log(`Enviando solicitud PUT a ${API_URL}/users/${id} con datos:`, userData);
      const response = await axios.put(`${API_URL}/users/${id}`, userData);
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },
  
  assignRoles: async (userId, roleIds) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/roles`, { roleIds });
      return response.data;
    } catch (error) {
      console.error('Error al asignar roles al usuario:', error);
      throw error;
    }
  }
};
