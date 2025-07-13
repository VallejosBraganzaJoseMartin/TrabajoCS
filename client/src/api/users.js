import axios from 'axios';

const API_URL = '/api/users';

export const usersApi = {
  getAll: () => axios.get(API_URL),
  getById: (id) => axios.get(`${API_URL}/${id}`),
  /* create: (user) => axios.post(API_URL, user), */
  update: (id, user) => axios.put(`${API_URL}/${id}`, user),
  delete: (id) => axios.delete(`${API_URL}/${id}`)
};
