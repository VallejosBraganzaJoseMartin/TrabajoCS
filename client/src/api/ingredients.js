import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const ingredientsApi = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ingredients`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener ingredientes:', error);
      throw error;
    }
  },
  create: async (ingredientData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ingredients`, ingredientData);
      return response.data;
    } catch (error) {
      console.error('Error al crear ingrediente:', error);
      throw error;
    }
  },
  update: async (id, ingredientData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/ingredients/${id}`, ingredientData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar ingrediente:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/ingredients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar ingrediente:', error);
      throw error;
    }
  },
  getAllByPizzaId: async (pizzaId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pizza-ingredients/${pizzaId}`);
      return response.data.data; // Solo el array de ingredientes
    } catch (error) {
      console.error('Error al obtener ingredientes de la pizza:', error);
      throw error;
    }
  },
  addToPizza: async ({ piz_id, ing_id, piz_ing_quantity }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/pizza-ingredients`, {
        piz_id,
        ing_id,
        piz_ing_quantity
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  removeFromPizza: async (piz_id, ing_id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/pizza-ingredients/${piz_id}/${ing_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateQuantity: async (piz_id, ing_id, piz_ing_quantity) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/pizza-ingredients/${piz_id}/${ing_id}`, { piz_ing_quantity });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
