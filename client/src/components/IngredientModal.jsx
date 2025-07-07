import React, { useEffect, useRef } from "react";

const IngredientModal = ({ open, onClose, onSubmit, ingredient, mode = "create" }) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (open && ingredient && formRef.current) {
      formRef.current.ing_name.value = ingredient.ing_name || "";
      formRef.current.ing_calories.value = ingredient.ing_calories || "";
      formRef.current.ing_state.value = ingredient.ing_state ? "true" : "false";
    } else if (open && formRef.current) {
      formRef.current.reset();
    }
  }, [open, ingredient]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col transform transition-all duration-300 scale-95 opacity-0" ref={node => node && requestAnimationFrame(() => node.classList.remove('scale-95', 'opacity-0'))} onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {mode === "edit" ? "Editar Ingrediente" : "Registrar Ingrediente"}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del ingrediente</label>
              <input name="ing_name" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-shadow" placeholder="Ej: Queso Mozzarella" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calorías</label>
              <input name="ing_calories" type="number" step="any" min="0" required className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent transition-shadow" placeholder="Ej: 120" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className="relative">
                <select name="ing_state" className="w-full border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent transition-shadow">
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button type="button" onClick={onClose} className="mr-3 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 font-semibold shadow-sm hover:shadow-md transition-all">{mode === "edit" ? "Guardar Cambios" : "Registrar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IngredientModal;
