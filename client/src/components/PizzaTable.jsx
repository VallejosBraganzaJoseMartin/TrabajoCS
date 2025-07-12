import React from "react";

const PizzaTable = ({ pizzas, loading, error, onDelete, onEdit }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Cabecera */}
      <div className="grid grid-cols-12 px-6 py-3 bg-[#f5f5f4] text-xs font-semibold text-gray-500 uppercase">
        <div className="col-span-1">ID</div>
        <div className="col-span-3">Pizza</div>
        <div className="col-span-2">Origen</div>
        <div className="col-span-3">Imagen (URL)</div>
        <div className="col-span-2">Estado</div>
        <div className="col-span-1">Acciones</div>
      </div>
      {/* Filas */}
      <div className="divide-y divide-gray-200">
        {pizzas.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No hay pizzas disponibles
          </div>
        ) : (
          pizzas.map((pizza) => (
            <div
              key={pizza.piz_id}
              className="grid grid-cols-12 px-6 py-4 items-center text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="col-span-1">#{pizza.piz_id}</div>
              <div className="col-span-3 font-semibold">{pizza.piz_name}</div>
              <div className="col-span-2">{pizza.piz_origin || 'No especificado'}</div>
              <div className="col-span-3">
                {pizza.url_image ? (
                  <a href={pizza.url_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate block max-w-[180px]" title={pizza.url_image}>
                    {pizza.url_image}
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Sin imagen</span>
                )}
              </div>
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pizza.piz_state 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pizza.piz_state ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <div className="col-span-1 flex space-x-3">
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
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                  onClick={() => onDelete(pizza.piz_id)}
                  title="Eliminar pizza"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PizzaTable;