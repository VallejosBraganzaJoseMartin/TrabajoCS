import axios from 'axios';
import apiClient from './apiClient';

const API_BASE_URL = 'http://localhost:3000/api';

export const pizzasApi = {
  // Obtener todas las pizzas
  getAll: async () => {
    try {
      const response = await apiClient.get(`/pizzas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pizzas:', error);
      throw error;
    }
  },

  // Obtener una pizza por ID
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/pizzas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pizza:', error);
      throw error;
    }
  },

  // Crear una nueva pizza
  create: async (pizzaData) => {
    try {
      const response = await apiClient.post(`/pizzas`, pizzaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear pizza:', error);
      throw error;
    }
  },

  // Actualizar una pizza
  update: async (id, pizzaData) => {
    try {
      const response = await apiClient.put(`/pizzas/${id}`, pizzaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar pizza:', error);
      throw error;
    }
  },

  // Eliminar una pizza
  delete: async (id) => {
    try {
      const response = await apiClient.delete(`/pizzas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar pizza:', error);
      throw error;
    }
  }
};