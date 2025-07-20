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
        <h2 className="text-xl font-bold mb-4">
          Asignar Funciones al Rol: {role ? role.name : ''}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Funciones Disponibles
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
              {availableFunctions.map(func => (
                <div key={func.id} className={`flex items-center p-2 ${selectedFunctions.includes(func.id) ? 'bg-gray-100 rounded' : ''}`}>
                  <input
                    type="checkbox"
                    id={`function-${func.id}`}
                    checked={selectedFunctions.includes(func.id)}
                    onChange={() => handleFunctionToggle(func.id)}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  {selectedFunctions.includes(func.id) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">Asignada</span>
                  )}
                  <label htmlFor={`function-${func.id}`} className="text-sm">
                    {func.name} {func.descripcion && `- ${func.descripcion}`}
                  </label>
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