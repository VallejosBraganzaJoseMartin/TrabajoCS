import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r">
      {/* Logo en Sidebar */}
      <div className="flex items-center justify-center h-16 border-b">
        <Link to="/pizzas" className="text-gray-800 text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 4a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM10 5a.5.5 0 01.5.5v1.5a.5.5 0 01-1 0V5.5A.5.5 0 0110 5z" />
            <path d="M5.15 11.24a3.5 3.5 0 014.95 0 4.48 4.48 0 005.198.54 1 1 0 01.503 1.63A6.48 6.48 0 0110 15.5a6.48 6.48 0 01-5.501-2.09 1 1 0 01.65-1.17z"/>
          </svg>
          <span>PizzAPI</span>
        </Link>
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-2">
        <Link to="/pizzas" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/pizzas' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          Pizzas
        </Link>
        <Link to="/menu" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/menu' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Menú
        </Link>
        <Link to="/ingredientes" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/ingredientes' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1.132a4.002 4.002 0 00-1.095 1.603l-1.148 2.296a1 1 0 00.447 1.372l3.536 1.768a1 1 0 001.372-.447l2.296-1.148A4.002 4.002 0 0013.868 7H15a1 1 0 001-1V4a1 1 0 00-1-1h-1.132a4.002 4.002 0 00-1.603-1.095l-2.296-1.148a1 1 0 00-1.372.447L7.828 4.47A4.002 4.002 0 007 5.132V6a1 1 0 001 1h.132a4.002 4.002 0 001.603 1.095l2.296 1.148a1 1 0 001.372-.447l1.148-2.296A4.002 4.002 0 0012.868 8H12a1 1 0 00-1-1V5.868a4.002 4.002 0 00-1.095-1.603L8.757 3.117a1 1 0 00-1.372.447L6.237 5.86A4.002 4.002 0 007.132 7H8a1 1 0 001-1V4.868a4.002 4.002 0 00-1.603-1.095L4.47 2.625a1 1 0 00-1.372.447l-1.148 2.296A4.002 4.002 0 002.868 7H2a1 1 0 00-1 1v2a1 1 0 001 1h1.132a4.002 4.002 0 001.603 1.095l2.296 1.148a1 1 0 001.372-.447L8.53 8.5A4.002 4.002 0 007.132 7H7a1 1 0 00-1 1v2a1 1 0 001 1h.132a4.002 4.002 0 001.603 1.095l2.296 1.148a1 1 0 001.372-.447l1.148-2.296A4.002 4.002 0 008.868 9H8a1 1 0 00-1-1V6.868a4.002 4.002 0 00-1.095-1.603L4.757 4.117a1 1 0 00-1.372.447L2.237 6.86A4.002 4.002 0 003.132 8H4a1 1 0 001-1V5.868a4.002 4.002 0 00-1.603-1.095L1.47 3.625a1 1 0 00-1.372.447l-1.148 2.296A4.002 4.002 0 000 7.232V9a1 1 0 001 1h1.132a4.002 4.002 0 001.603 1.095l2.296 1.148a1 1 0 001.372-.447L8.53 8.5A4.002 4.002 0 007.132 7H7a1 1 0 00-1 1v2a1 1 0 001 1h.132a4.002 4.002 0 001.603 1.095l2.296 1.148a1 1 0 001.372-.447l1.148-2.296A4.002 4.002 0 0011.868 10H11a1 1 0 00-1-1V7.868a4.002 4.002 0 00-1.095-1.603L7.757 5.117a1 1 0 00-1.372.447L5.237 7.86A4.002 4.002 0 006.132 9H7a1 1 0 001-1V6.868a4.002 4.002 0 00-1.603-1.095L3.47 4.625a1 1 0 00-1.372.447L1 7.368V2a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Ingredientes
        </Link>
        <Link to="/gestion" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/gestion' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 10a4 4 0 100-8 4 4 0 000 8z" />
            <path fillRule="evenodd" d="M2 16a6 6 0 1112 0H2z" clipRule="evenodd" />
          </svg>
          Usuarios
        </Link>
        <Link to="/roles" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/roles' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Roles
        </Link>
        <Link to="/funciones" className={`flex items-center px-4 py-2 text-sm font-semibold ${location.pathname === '/funciones' ? 'text-red-600 border-l-4 border-red-500' : 'text-gray-500 border-l-4 border-transparent hover:text-red-600 hover:border-red-500 transition-colors duration-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Funciones
        </Link>
      </div>
      {/* Botón de Cerrar Sesión */}
      <div className="p-4 mt-auto border-t">
        <a href="#" className="flex items-center w-full px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Cerrar sesión</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;