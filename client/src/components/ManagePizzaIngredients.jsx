import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ingredientsApi } from "../api/ingredients";
import { pizzasApi } from "../api/pizzas";
import Sidebar from "./Sidebar";
import Header from "./Header";

const ManagePizzaIngredients = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [currentIngredients, setCurrentIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedIngId, setSelectedIngId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    Promise.all([
      pizzasApi.getById(id),
      ingredientsApi.getAllByPizzaId(id),
      ingredientsApi.getAll()
    ])
      .then(([pizzaRes, pizzaIngs, allIngs]) => {
        setPizza(pizzaRes.data || pizzaRes);
        setCurrentIngredients(Array.isArray(pizzaIngs) ? pizzaIngs : []);
        const activeIngredients = Array.isArray(allIngs.data) 
          ? allIngs.data.filter(ing => ing.ing_state === true)
          : [];
        setAllIngredients(activeIngredients);
      })
      .catch(() => setError("Error al cargar ingredientes"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!selectedIngId) {
      setError("Debe seleccionar un ingrediente");
      return;
    }
    
    if (!quantity) {
      setError("Debe ingresar la cantidad del ingrediente");
      return;
    }
    
    setAdding(true);
    try {
      await ingredientsApi.addToPizza({
        piz_id: id,
        ing_id: selectedIngId,
        piz_ing_quantity: quantity
      });
      const pizzaIngs = await ingredientsApi.getAllByPizzaId(id);
      setCurrentIngredients(Array.isArray(pizzaIngs) ? pizzaIngs : []);
      setSelectedIngId("");
      setQuantity("");
      setSuccessMessage("Ingrediente agregado correctamente");
    } catch (error) {
      // Extraer mensaje detallado del error
      let errorMessage = "No se pudo añadir el ingrediente";
      
      if (error.response && error.response.data) {
        if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (ing_id) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await ingredientsApi.removeFromPizza(id, ing_id);
      setCurrentIngredients(currentIngredients.filter(i => i.ing_id !== ing_id));
      setSuccessMessage("Ingrediente eliminado correctamente");
    } catch (error) {
      let errorMessage = "No se pudo eliminar el ingrediente";
      
      if (error.response && error.response.data) {
        if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  const handleEditQuantity = async (ing_id, newQty) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await ingredientsApi.updateQuantity(id, ing_id, newQty);
      setCurrentIngredients(currentIngredients.map(i => i.ing_id === ing_id ? { ...i, piz_ing_quantity: newQty } : i));
      setSuccessMessage("Cantidad actualizada correctamente");
    } catch (error) {
      let errorMessage = "No se pudo actualizar la cantidad";
      
      if (error.response && error.response.data) {
        if (error.response.data.details) {
          errorMessage = error.response.data.details;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  if (loading) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              Gestionar Ingredientes: <span className="text-red-600">{pizza?.piz_name}</span>
            </h1>
            <button onClick={() => navigate(-1)} className="mt-4 sm:mt-0 text-gray-400 hover:text-red-600 transition-colors text-base font-medium">
              Volver
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredientes en la Pizza
              </h2>
              <div className="bg-white rounded-lg shadow-md">
                <div className="divide-y divide-gray-200">
                  {currentIngredients.length === 0 ? (
                    <div className="p-4 text-gray-400">Sin ingredientes</div>
                  ) : currentIngredients.map((ing) => (
                    <div key={ing.ing_id} className="p-4 flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{ing.ing_name}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          value={ing.piz_ing_quantity}
                          onChange={e => handleEditQuantity(ing.ing_id, e.target.value)}
                          className="w-24 text-sm border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                        />
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          onClick={() => handleDelete(ing.ing_id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Añadir Nuevo Ingrediente
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                {allIngredients.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded" role="alert">
                    <p className="text-sm">No hay ingredientes activos disponibles para agregar.</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleAdd}>
                  <div>
                    <label htmlFor="ingredient" className="block text-sm font-medium text-gray-700">Ingrediente</label>
                    <select
                      id="ingredient"
                      name="ing_id"
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base sm:text-sm rounded-md ${!selectedIngId && error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}
                      value={selectedIngId}
                      onChange={e => setSelectedIngId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Selecciona un ingrediente...</option>
                      {allIngredients.length > 0 ? (
                        allIngredients.map(ing => (
                          <option key={ing.ing_id} value={ing.ing_id}>{ing.ing_name}</option>
                        ))
                      ) : (
                        <option value="" disabled>No hay ingredientes activos disponibles</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Cantidad</label>
                    <input
                      type="number"
                      name="piz_ing_quantity"
                      id="quantity"
                      min="1"
                      className={`mt-1 block w-full shadow-sm sm:text-sm rounded-md ${!quantity && error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-red-500 focus:border-red-500'}`}
                      placeholder="Ej: 100 gr"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={adding || allIngredients.length === 0}
                    >
                      {adding ? 'Agregando...' : 'Añadir a la Pizza'}
                    </button>
                  </div>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4" role="alert">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4" role="alert">
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}
                </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagePizzaIngredients;
