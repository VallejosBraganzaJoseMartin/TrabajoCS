import React from "react";
import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  return (
    <div className="flex items-center justify-between h-16 bg-white border-b px-6">
      {/* Migas de Pan (Breadcrumbs) */}
      <div className="text-sm text-gray-500">
        <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
        <span className="mx-2">/</span>
        {location.pathname === "/ingredientes" ? (
          <span className="font-semibold text-gray-700">Ingredientes</span>
        ) : (
          <span className="font-semibold text-gray-700">Pizzas</span>
        )}
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