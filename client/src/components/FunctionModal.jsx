import React from "react";

const FunctionModal = ({ open, onClose, onSubmit, func, mode }) => {
  if (!open) return null;

  const isEditMode = mode === "edit";
  const title = isEditMode ? "Editar Función" : "Añadir Nueva Función";
  const submitText = isEditMode ? "Actualizar Función" : "Crear Función";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
        
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors" 
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="funcion_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Función
              </label>
              <input 
                type="text" 
                name="funcion_name" 
                id="funcion_name" 
                defaultValue={isEditMode ? func?.name : ""}
                placeholder="Ej: Administrar Pizzas" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent" 
                required 
              />
            </div>
            
            <div>
              <label htmlFor="funcion_descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea 
                name="funcion_descripcion" 
                id="funcion_descripcion" 
                rows="3" 
                defaultValue={isEditMode ? func?.description : ""}
                placeholder="Ej: Permite gestión total sobre Pizzas" 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
              />
            </div>

            <div className="flex items-center pt-2">
              <input 
                id="funcion_state" 
                type="checkbox" 
                name="funcion_state" 
                defaultChecked={isEditMode ? func?.state : true}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" 
              />
              <label htmlFor="funcion_state" className="ml-2 block text-sm text-gray-900">
                Función Activa
              </label>
            </div>
          </div>
          
          {/* Pie del Modal */}
          <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold shadow-sm hover:shadow-md transition-all"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FunctionModal;
