import React, { useEffect, useRef } from "react";

const RoleModal = ({ open, onClose, onSubmit, role, mode = "create" }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (open && role && formRef.current) {
      formRef.current.role_name.value = role.name || "";
      formRef.current.role_descripcion.value = role.descripcion || "";
      formRef.current.role_state.checked = role.state !== false;
    } else if (open && formRef.current) {
      formRef.current.reset();
      formRef.current.role_state.checked = true;
    }
  }, [open, role]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {mode === "edit" ? "Editar Rol" : "Añadir Nuevo Rol"}
          </h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={onClose} aria-label="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form ref={formRef} onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="role_name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
              <input
                type="text"
                name="role_name"
                id="role_name"
                placeholder="Ej: Administrador"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="role_descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="role_descripcion"
                id="role_descripcion"
                rows="3"
                placeholder="Ej: Control total sobre el sistema"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent"
              ></textarea>
            </div>
            <div className="flex items-center pt-2">
              <input
                id="role_state"
                type="checkbox"
                name="role_state"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="role_state" className="ml-2 block text-sm text-gray-900">Rol Activo</label>
            </div>
          </div>
          <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold shadow-sm hover:shadow-md transition-all">
              {mode === "edit" ? "Guardar Cambios" : "Crear Rol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
