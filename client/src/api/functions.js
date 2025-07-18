import apiClient from './apiClient';

export const functionsApi = {
  // Obtener todas las funciones
  getAll: async () => {
    try {
      const response = await apiClient.get('/funciones');
      return response.data.data; // El backend devuelve { message, data }
    } catch (error) {
      console.error('Error al obtener funciones:', error);
      throw error;
    }
  },

  // Crear una nueva función
  create: async (functionData) => {
    try {
      const response = await apiClient.post('/funciones', {
        funcion_name: functionData.name,
        funcion_descripcion: functionData.description,
        funcion_state: functionData.state
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al crear función:', error);
      throw error;
    }
  },

  // Actualizar una función
  update: async (id, functionData) => {
    try {
      const response = await apiClient.put(`/funciones/${id}`, {
        funcion_name: functionData.name,
        funcion_descripcion: functionData.description,
        funcion_state: functionData.state
      });
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar función:', error);
      throw error;
    }
  },

  // Eliminar una función
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/funciones/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error al eliminar función:', error);
      throw error;
    }
  }
};
