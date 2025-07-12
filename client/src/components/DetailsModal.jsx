import React, { useEffect, useState } from "react";
import { ingredientsApi } from '../api/ingredients';

const PizzaDetailsModal = ({ open, onClose, pizza }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && pizza && pizza.piz_id) {
      setLoading(true);
      setError(null);
      ingredientsApi.getAllByPizzaId(pizza.piz_id)
        .then((ingredients) => {
          setIngredients(Array.isArray(ingredients) ? ingredients : []);
        })
        .catch((err) => {
          setError('No se pudieron cargar los ingredientes');
          setIngredients([]);
        })
        .finally(() => setLoading(false));
    } else {
      setIngredients([]);
      setError(null);
    }
  }, [open, pizza]);

  if (!open) {
    return null;
  }

  const displayPizza = pizza || {
    name: "Margherita",
    origin: "Nápoles, Italia",
    state: true,
    imageUrl: "https://images.unsplash.com/photo-1598021680133-eb3a737d7a2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col transform transition-all duration-300 scale-95 opacity-0"
        ref={node => node && requestAnimationFrame(() => node.classList.remove('scale-95', 'opacity-0'))}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Detalles de la Pizza
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
        {/* Contenido del Modal */}
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna de la Imagen */}
                <div className="md:col-span-1">
                    <div className="rounded-lg overflow-hidden border">
                        <img src={displayPizza.imageUrl || displayPizza.url_image} alt={`Pizza ${displayPizza.name || displayPizza.piz_name}`} className="w-full h-auto object-cover" />
                    </div>
                </div>
                {/* Columna de Detalles e Ingredientes */}
                <div className="md:col-span-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{displayPizza.name || displayPizza.piz_name}</h1>
                            <p className="text-md text-gray-500 mt-1">{displayPizza.origin || displayPizza.piz_origin}</p>
                        </div>
                        <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold ${displayPizza.state !== undefined ? (displayPizza.state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : (displayPizza.piz_state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}`}>
                            {(displayPizza.state !== undefined ? (displayPizza.state ? 'Activo' : 'Inactivo') : (displayPizza.piz_state ? 'Activo' : 'Inactivo'))}
                        </span>
                    </div>
                    {/* Sección de Ingredientes */}
                    <div className="mt-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-3">Ingredientes</h3>
                        {loading ? (
                          <div className="text-gray-500">Cargando ingredientes...</div>
                        ) : error ? (
                          <div className="text-red-500">{error}</div>
                        ) : (
                          <div className="divide-y divide-gray-200 border rounded-lg">
                            {ingredients.length === 0 ? (
                              <div className="p-3 text-gray-400">Sin ingredientes</div>
                            ) : ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50">
                                    <span className="font-medium text-gray-700">{ingredient.ing_name}</span>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">{ingredient.piz_ing_quantity}</span>
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.796 12.062a1 1 0 00.671 1.605h13.592a1 1 0 00.671-1.605l-6.796-12.062a1 1 0 00-.822-.934zM12 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                            </svg>
                                            {ingredient.ing_calories} kcal
                                        </span>
                                    </div>
                                </div>
                            ))}
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        {/* Pie del Modal */}
        <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetailsModal;
