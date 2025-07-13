import axios from 'axios';

// Crea una instancia de axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Interceptor para agregar el token a cada request si existe
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
