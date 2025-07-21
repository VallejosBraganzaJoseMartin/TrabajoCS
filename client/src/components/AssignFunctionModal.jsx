import React, { useState, useEffect } from 'react';

const AssignFunctionModal = ({ isOpen, onClose, onSave, role, availableFunctions }) => {
  const [selectedFunctions, setSelectedFunctions] = useState([]);

  useEffect(() => {
    if (role && role.funciones) {
      // Mapear los IDs de las funciones del rol
      const functionIds = role.funciones.map(func => {
        // Manejar tanto el formato del frontend (id) como del backend (funcion_id)
        return func.id || func.funcion_id;
      });
      setSelectedFunctions(functionIds);
    } else {
      setSelectedFunctions([]);
    }
  }, [role]);
  
  // Función auxiliar para verificar si una función está seleccionada
  const isFunctionSelected = (func) => {
    const funcId = func.id || func.funcion_id;
    return selectedFunctions.includes(funcId);
  };

  const handleFunctionToggle = (functionId) => {
    if (selectedFunctions.includes(functionId)) {
      setSelectedFunctions(selectedFunctions.filter(id => id !== functionId));
    } else {
      setSelectedFunctions([...selectedFunctions, functionId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedFunctions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">
            Asignar Funciones al Rol: <span className="text-red-600">{role ? (role.name || role.role_name) : ''}</span>
          </h2>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm font-medium">
            {selectedFunctions.length} seleccionadas
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">Haga clic en una función para asignarla o desasignarla. Las funciones con un visto (✓) están asignadas al rol.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 text-sm font-bold">
                Funciones Disponibles
              </label>
              <div className="flex items-center">
                <button 
                  type="button" 
                  className="text-xs text-blue-600 hover:text-blue-800 mr-3"
                  onClick={() => setSelectedFunctions(availableFunctions.map(f => f.id || f.funcion_id))}
                >
                  Seleccionar todas
                </button>
                <button 
                  type="button" 
                  className="text-xs text-gray-600 hover:text-gray-800"
                  onClick={() => setSelectedFunctions([])}
                >
                  Desmarcar todas
                </button>
              </div>
            </div>
            
            <div className="space-y-1 max-h-60 overflow-y-auto p-2 border rounded bg-gray-50">
              {availableFunctions.map(func => (
                <div 
                  key={func.id || func.funcion_id} 
                  className={`flex items-center p-2 rounded transition-all duration-200 ${isFunctionSelected(func) ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}
                  onClick={() => handleFunctionToggle(func.id || func.funcion_id)}
                >
                  {isFunctionSelected(func) ? (
                    <div className="flex items-center justify-center w-6 h-6 mr-3 rounded-full bg-green-500 text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 mr-3 rounded-full border-2 border-gray-300"></div>
                  )}
                  <div className="flex-grow">
                    <span className={`${isFunctionSelected(func) ? 'font-medium text-green-700' : 'text-gray-700'}`}>
                      {func.name || func.funcion_name}
                    </span>
                    {(func.descripcion || func.funcion_descripcion) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {func.descripcion || func.funcion_descripcion}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {availableFunctions.length === 0 && (
                <p className="text-gray-500 text-sm">No hay funciones disponibles</p>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignFunctionModal;