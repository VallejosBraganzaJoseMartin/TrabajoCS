import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../contexts/PermissionContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { hasFunction } = usePermission();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 md:hidden">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <Link to="/pizzas" className="text-gray-800 text-xl font-bold flex items-center" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM10 5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V5.5A.5.5 0 0110 5z" />
              <path d="M5.15 11.24a3.5 3.5 0 014.95 0 4.48 4.48 0 005.198.54 1 1 0 01.503 1.63A6.48 6.48 0 0110 15.5a6.48 6.48 0 01-5.501-2.09 1 1 0 01.65-1.17z"/>
            </svg>
            <span>PizzAPI</span>
          </Link>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col p-4 space-y-2 overflow-y-auto h-full">
          {(hasFunction('ver_pizzas') || hasFunction('gestionar_pizzas')) && (
            <Link 
              to="/pizzas" 
              className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/pizzas' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Pizzas
            </Link>
          )}
          
          <Link 
            to="/menu" 
            className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/menu' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menú
          </Link>
          
          {(hasFunction('ver_ingredientes') || hasFunction('gestionar_ingredientes')) && (
            <Link 
              to="/ingredientes" 
              className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/ingredientes' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
              </svg>
              Ingredientes
            </Link>
          )}
          
          {/* Sección de Administración */}
          {(hasFunction('gestionar_usuarios') || hasFunction('ver_usuarios') || hasFunction('gestionar_roles')) && (
            <div className="mt-6 mb-2 px-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administración</h3>
            </div>
          )}
          
          {(hasFunction('gestionar_usuarios') || hasFunction('ver_usuarios')) && (
            <Link 
              to="/usuarios" 
              className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/usuarios' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Usuarios
            </Link>
          )}
          
          {hasFunction('gestionar_roles') && (
            <Link 
              to="/roles" 
              className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/roles' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Roles
            </Link>
          )}
          
          {hasFunction('gestionar_funciones') && (
            <Link 
              to="/funciones" 
              className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/funciones' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent'}`}
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Funciones
            </Link>
          )}
          
          {/* Botón de Cerrar Sesión */}
          <div className="mt-auto pt-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-red-100 hover:text-red-700 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;