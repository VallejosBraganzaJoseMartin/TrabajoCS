import React from "react";
import { useNavigate } from "react-router-dom";

const PizzaTable = ({ pizzas, loading, error, onDelete, onEdit }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando pizzas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Vista para móviles
  const MobileView = () => (
    <div className="md:hidden">
      {pizzas.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-500">
          No hay pizzas disponibles
        </div>
      ) : (
        <div className="space-y-4">
          {pizzas.map((pizza) => (
            <div key={pizza.piz_id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">{pizza.piz_name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pizza.piz_state 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pizza.piz_state ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">ID:</span> #{pizza.piz_id}
              </div>
              
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Origen:</span> {pizza.piz_origin || 'No especificado'}
              </div>
              
              <div className="text-sm text-gray-600 mb-3">
                <span className="font-medium">Imagen:</span>{' '}
                {pizza.url_image ? (
                  <a href={pizza.url_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate block" title={pizza.url_image}>
                    Ver imagen
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Sin imagen</span>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
                <button 
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-1"
                  onClick={() => onEdit(pizza)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-1"
                  onClick={() => navigate(`/pizzas/${pizza.piz_id}/ingredientes`)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button 
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1"
                  onClick={() => onDelete(pizza.piz_id, pizza.piz_name)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Vista para desktop
  const DesktopView = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pizza</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origen</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pizzas.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No hay pizzas disponibles
              </td>
            </tr>
          ) : (
            pizzas.map((pizza) => (
              <tr key={pizza.piz_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{pizza.piz_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pizza.piz_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pizza.piz_origin || 'No especificado'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pizza.url_image ? (
                    <a href={pizza.url_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate block max-w-[180px]" title={pizza.url_image}>
                      {pizza.url_image}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Sin imagen</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    pizza.piz_state 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pizza.piz_state ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div className="flex justify-center space-x-3">
                    <button 
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => onEdit(pizza)}
                      title="Editar pizza"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      className="text-gray-400 hover:text-green-600 transition-colors duration-200"
                      onClick={() => navigate(`/pizzas/${pizza.piz_id}/ingredientes`)}
                      title="Gestionar ingredientes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <button 
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                      onClick={() => onDelete(pizza.piz_id, pizza.piz_name)}
                      title="Eliminar pizza"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
};

export default PizzaTable;