import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = ({ currentPage }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const getUserFullName = () => {
    if (!user) return "Usuario actual";
    const nombres = user.user_names || "";
    const apellidos = user.user_surenames || "";
    const fullName = `${nombres} ${apellidos}`.trim();
    if (fullName && fullName !== "") return fullName;
    if (user.user_email) return user.user_email;
    return "Usuario actual";
  };
  
  // Si se pasa currentPage, usarlo; si no, determinar desde la ubicación
  const getPageName = () => {
    if (currentPage) return currentPage;
    
    switch (location.pathname) {
      case "/ingredientes":
        return "Ingredientes";
      case "/menu":
        return "Menú";
      case "/gestion":
        return "Gestión de Usuarios";
      case "/roles":
        return "Roles";
      case "/funciones":
        return "Gestión de Funciones";
      default:
        if (location.pathname.includes("/roles/") && location.pathname.includes("/functions")) {
          return "Asignar Funciones";
        }
        return "Pizzas";
    }
  };

  const getBreadcrumbs = () => {
    if (currentPage) {
      return (
        <>
          <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-700">{currentPage}</span>
        </>
      );
    }

    // Breadcrumbs especiales para rutas anidadas
    if (location.pathname.includes("/roles/") && location.pathname.includes("/functions")) {
      return (
        <>
          <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
          <span className="mx-2">/</span>
          <Link to="/roles" className="hover:text-red-600">Roles</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-700">Asignar Funciones</span>
        </>
      );
    }

    // Breadcrumbs especiales para asignar roles a usuarios
    if (location.pathname.includes("/users/") && location.pathname.includes("/roles")) {
      return (
        <>
          <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
          <span className="mx-2">/</span>
          <Link to="/gestion" className="hover:text-red-600">Gestión de Usuarios</Link>
          <span className="mx-2">/</span>
          <span className="font-semibold text-gray-700">Asignar Roles</span>
        </>
      );
    }

    // Breadcrumbs por defecto
    return (
      <>
        <Link to="/pizzas" className="hover:text-red-600">PizzAPI</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-gray-700">{getPageName()}</span>
      </>
    );
  };

  return (
    <div className="flex items-center justify-between h-16 bg-white border-b px-6">
      {/* Migas de Pan (Breadcrumbs) */}
      <div className="text-sm text-gray-500">
        {getBreadcrumbs()}
      </div>

      {/* Sección Derecha: Búsqueda y Perfil */}
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex items-center">
          <div className="text-sm text-gray-500">{getUserFullName()}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;