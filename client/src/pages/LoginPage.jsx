import React, {useState} from 'react';
import { authApi } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    setLoading(true);
    
    try {
      const response = await authApi.login({ user_email: email, user_password: password });
      console.log('login response:', response);
      // Soporta ambas estructuras: axios (response.data) o fetch (response)
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user;
      login(token, user);
      navigate('/menu', { replace: true });
    } catch (error) {
      console.log("Error de login:", error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        setError('Credenciales inválidas. Por favor, verifica tu email y contraseña.');
      } else if (error.response?.status === 403) {
        setError(error.response?.data?.message || 'Tu cuenta está inactiva. Contacta al administrador para activarla.');
      } else if (error.response?.status === 500) {
        setError('Error del servidor. Por favor, inténtalo más tarde.');
      } else if (error.message === 'Network Error') {
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      {/* Columna Izquierda: Imagen */}
      <div className="hidden lg:block relative w-1/2 bg-gray-800">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
          alt="Pizza en horno de leña"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-4xl font-bold">PizzAPI</h1>
          <p className="mt-2 text-lg text-gray-300">Mejor que el siiu.</p>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-100">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <a href="#" className="text-gray-800 text-2xl font-bold flex items-center justify-center lg:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM10 5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V5.5A.5.5 0 0110 5z" />
                <path d="M5.15 11.24a3.5 3.5 0 014.95 0 4.48 4.48 0 005.198.54 1 1 0 01.503 1.63A6.48 6.48 0 0110 15.5a6.48 6.48 0 01-5.501-2.09 1 1 0 01.65-1.17z"/>
              </svg>
              <span>PizzAPI</span>
            </a>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido de nuevo</h2>
            <p className="mt-2 text-sm text-gray-600">Por favor, inicia sesión para acceder al papusistema.</p>
          </div>

          <form className="space-y-6" autoComplete="off" onSubmit={handleSubmit}>
            {/* Alerta de error */}
            <Alert 
              type="error" 
              message={error} 
              show={!!error} 
              onClose={handleCloseAlert}
            />
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
