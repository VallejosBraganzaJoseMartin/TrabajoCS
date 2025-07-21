import apiClient from './apiClient';

export const funcionesApi = {
  // Obtener todas las funciones
  getAll: async () => {
    try {
      const response = await apiClient.get('/funciones');
      // Mapear la estructura del backend a la esperada por el frontend
      const funciones = response.data.data || response.data;
      return Array.isArray(funciones) ? funciones.map(funcion => ({
        id: funcion.funcion_id,
        name: funcion.funcion_name,
        descripcion: funcion.funcion_descripcion
      })) : [];
    } catch (error) {
      console.error('Error al obtener funciones:', error);
      throw error;
    }
  },

  // Crear una nueva función
  create: async (funcionData) => {
    try {
      // Mapear al formato esperado por el backend
      const backendData = {
        funcion_name: funcionData.name,
        funcion_descripcion: funcionData.descripcion
      };
      const response = await apiClient.post('/funciones', backendData);
      const funcion = response.data.data || response.data;
      return {
        id: funcion.funcion_id,
        name: funcion.funcion_name,
        descripcion: funcion.funcion_descripcion
      };
    } catch (error) {
      console.error('Error al crear función:', error);
      throw error;
    }
  },

  // Obtener una función por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/funciones/${id}`);
      const funcion = response.data.data || response.data;
      return {
        id: funcion.funcion_id,
        name: funcion.funcion_name,
        descripcion: funcion.funcion_descripcion
      };
    } catch (error) {
      console.error('Error al obtener función:', error);
      throw error;
    }
  },

  // Actualizar una función
  update: async (id, funcionData) => {
    try {
      const backendData = {
        funcion_name: funcionData.name,
        funcion_descripcion: funcionData.descripcion
      };
      const response = await apiClient.put(`/funciones/${id}`, backendData);
      const funcion = response.data.data || response.data;
      return {
        id: funcion.funcion_id,
        name: funcion.funcion_name,
        descripcion: funcion.funcion_descripcion
      };
    } catch (error) {
      console.error('Error al actualizar función:', error);
      throw error;
    }
  },

  // Eliminar una función
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/funciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar función:', error);
      throw error;
    }
  }
};