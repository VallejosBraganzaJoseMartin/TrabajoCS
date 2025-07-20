import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ currentPage, onMenuToggle }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Si se pasa currentPage, usarlo; si no, determinar desde la ubicación
  const getPageName = () => {
    if (currentPage) return currentPage;
    
    switch (location.pathname) {
      case "/ingredientes":
        return "Ingredientes";
      case "/menu":
        return "Menú";
      case "/usuarios":
        return "Usuarios";
      case "/roles":
        return "Roles";
      case "/funciones":
        return "Funciones";
      default:
        return "Pizzas";
    }
  };

  return (
    <div className="flex items-center justify-between h-16 bg-white border-b px-4 md:px-6">
      {/* Botón de menú móvil */}
      <button 
        className="md:hidden text-gray-500 hover:text-red-500"
        onClick={onMenuToggle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Migas de Pan (Breadcrumbs) */}
      <div className="text-sm text-gray-500 hidden md:block">
        <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-700">{getPageName()}</span>
      </div>

      {/* Título en móvil */}
      <div className="md:hidden text-lg font-semibold text-gray-800">
        {getPageName()}
      </div>

      {/* Sección Derecha: Perfil */}
      <div className="flex flex-col items-end">
        <div className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
          {user && user.user_names ? `${user.user_names} ${user.user_surenames || ''}` : 'Usuario'}
        </div>
        {/* Mostrar el rol principal debajo del nombre */}
        {user && user.roles && user.roles.length > 0 && (
          <div className="text-xs text-gray-500 font-semibold truncate max-w-[150px]">
            {user.roles[0].role_name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;