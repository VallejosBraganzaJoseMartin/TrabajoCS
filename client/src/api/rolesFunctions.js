import apiClient from './apiClient';

export const rolesFunctionsApi = {
  // Obtener funciones de un rol
  getFunctionsByRole: async (roleId) => {
    try {
      const response = await apiClient.get(`/roles-funciones/${roleId}/funciones`);
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener funciones del rol:', error);
      throw error;
    }
  },

  // Asignar funciones a un rol
  assignFunctionsToRole: async (roleId, functionIds) => {
    try {
      const response = await apiClient.post(`/roles-funciones/${roleId}/funciones`, {
        funcion_ids: functionIds
      });
      return response.data;
    } catch (error) {
      console.error('Error al asignar funciones al rol:', error);
      throw error;
    }
  },

  // Remover una función de un rol
  removeFunctionFromRole: async (roleId, functionId) => {
    try {
      const response = await apiClient.delete(`/roles-funciones/${roleId}/funciones/${functionId}`);
      return response.data;
    } catch (error) {
      console.error('Error al remover función del rol:', error);
      throw error;
    }
  }
};
