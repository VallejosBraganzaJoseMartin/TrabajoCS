import apiClient from './apiClient';

export const permissionsApi = {
  // Asignar roles a un usuario
  assignRolesToUser: async (userId, roleIds) => {
    try {
      const response = await apiClient.post(`/users/${userId}/roles`, { roleIds });
      return response.data;
    } catch (error) {
      console.error('Error al asignar roles al usuario:', error);
      throw error;
    }
  },

  // Asignar funciones a un rol
  assignFunctionsToRole: async (roleId, functionIds) => {
    try {
      const response = await apiClient.post(`/roles/${roleId}/functions`, { functionIds });
      return response.data;
    } catch (error) {
      console.error('Error al asignar funciones al rol:', error);
      throw error;
    }
  },

  // Obtener funciones de un rol
  getRoleFunctions: async (roleId) => {
    try {
      const response = await apiClient.get(`/roles/${roleId}/functions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener funciones del rol:', error);
      throw error;
    }
  }
};