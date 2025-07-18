import apiClient from './apiClient';

export const userRolesApi = {
  // Obtener roles de un usuario específico
  getRolesByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/roles-usuarios/${userId}/roles`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error getting roles by user:', error);
      throw error;
    }
  },

  // Asignar roles a un usuario
  assignRolesToUser: async (userId, roleIds) => {
    try {
      const response = await apiClient.post(`/roles-usuarios/${userId}/roles`, {
        role_ids: roleIds
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning roles to user:', error);
      throw error;
    }
  },

  // Remover un rol específico de un usuario
  removeRoleFromUser: async (userId, roleId) => {
    try {
      const response = await apiClient.delete(`/roles-usuarios/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  }
};
