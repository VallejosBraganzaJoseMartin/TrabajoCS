import React from "react";
import { useLocation, Link } from "react-router-dom";

const Header = ({ currentPage }) => {
  const location = useLocation();
  
  // Si se pasa currentPage, usarlo; si no, determinar desde la ubicación
  const getPageName = () => {
    if (currentPage) return currentPage;
    
    switch (location.pathname) {
      case "/ingredientes":
        return "Ingredientes";
      case "/menu":
        return "Menú";
      default:
        return "Pizzas";
    }
  };

  return (
    <div className="flex items-center justify-between h-16 bg-white border-b px-6">
      {/* Migas de Pan (Breadcrumbs) */}
      <div className="text-sm text-gray-500">
        <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-700">{getPageName()}</span>
      </div>

      {/* Sección Derecha: Búsqueda y Perfil */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex items-center">
          <div className="text-sm text-gray-500">Usuario actual</div>
        </div>
      </div>
    </div>
  );
};

export default Header;