import axios from 'axios';

const API_URL = '/api/auth';

export const authApi = {
  register: (user) => axios.post(`${API_URL}/register`, user),
  login: (credentials) => axios.post(`${API_URL}/login`, credentials),
  logout: (token) => axios.post(`${API_URL}/logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  })
};
