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

  const pizzaName = displayPizza.name || displayPizza.piz_name;
  const pizzaOrigin = displayPizza.origin || displayPizza.piz_origin;
  const pizzaImage = displayPizza.imageUrl || displayPizza.url_image;
  const pizzaState = displayPizza.state !== undefined ? displayPizza.state : displayPizza.piz_state;

  const totalCalories = ingredients.reduce((total, ingredient) => total + (ingredient.ing_calories || 0), 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Detalles de la Pizza
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido principal */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 12rem)' }}>
          <div className="flex flex-col">
            {/* Título, imagen pequeña y estado en una sola fila */}
            <div className="flex items-start gap-4 mb-6">
              {/* Imagen pequeña */}
              <div className="flex-shrink-0">
                <img
                  src={pizzaImage}
                  alt={`Pizza ${pizzaName}`}
                  className="w-20 h-20 object-cover rounded-lg shadow-md"
                />
              </div>
              
              {/* Información principal */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{pizzaName}</h1>
                <p className="text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {pizzaOrigin}
                </p>
              </div>
              
              {/* Estado y calorías */}
              <div className="flex-shrink-0 text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  pizzaState ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {pizzaState ? 'Activo' : 'Inactivo'}
                </span>
                {totalCalories > 0 && (
                  <div className="text-sm text-gray-500 mt-2">
                    Total: {totalCalories} kcal
                  </div>
                )}
              </div>
            </div>

            {/* Sección de ingredientes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Ingredientes
              </h3>

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-gray-500">Cargando ingredientes...</div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-700">{error}</span>
                    </div>
                  </div>
                ) : ingredients.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">No hay ingredientes disponibles</div>
                    <div className="text-gray-400 text-sm mt-1">Esta pizza no tiene ingredientes registrados</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800">{ingredient.ing_name}</h4>
                            <p className="text-sm text-gray-500">Cantidad: {ingredient.piz_ing_quantity}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l-6.796 12.062a1 1 0 00.671 1.605h13.592a1 1 0 00.671-1.605l-6.796-12.062a1 1 0 00-.822-.934zM12 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              {ingredient.ing_calories} kcal
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {ingredients.length > 0 && (
              <span>
                {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''}
                {totalCalories > 0 && ` • ${totalCalories} kcal total`}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 font-medium transition-colors duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaDetailsModal;