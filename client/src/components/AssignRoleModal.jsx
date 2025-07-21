import React, { useState, useEffect } from 'react';

const AssignRoleModal = ({ isOpen, onClose, onSave, user, availableRoles }) => {
  const [selectedRoles, setSelectedRoles] = useState([]);

  useEffect(() => {
    if (user && user.roles) {
      // Extraer los IDs de los roles del usuario
      const roleIds = user.roles.map(role => role.id || role.role_id);
      console.log('Roles del usuario:', user.roles);
      console.log('IDs de roles seleccionados:', roleIds);
      setSelectedRoles(roleIds);
    } else {
      setSelectedRoles([]);
    }
  }, [user]);

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(id => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selectedRoles);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Asignar Roles a {user ? `${user.firstName || user.user_names} ${user.lastName || user.user_surenames}` : 'Usuario'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Roles Disponibles
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
              {availableRoles.map(role => (
                <div key={role.id} className={`flex items-center p-2 ${selectedRoles.includes(role.id) ? 'bg-gray-100 rounded' : ''}`}>
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                    className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  {selectedRoles.includes(role.id) && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">Asignado</span>
                  )}
                  <label htmlFor={`role-${role.id}`} className="text-sm">
                    {role.name} {role.descripcion && `- ${role.descripcion}`}
                  </label>
                </div>
              ))}
              {availableRoles.length === 0 && (
                <p className="text-gray-500 text-sm">No hay roles disponibles</p>
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

export default AssignRoleModal;