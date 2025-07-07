import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import IngredientTable from "../components/IngredientTable";
import IngredientModal from "../components/IngredientModal";
import { ingredientsApi } from "../api/ingredients";

const IngredientsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await ingredientsApi.getAll();
        setIngredients(response.data || response);
      } catch (err) {
        setError('Error al cargar los ingredientes');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const handleOpenModal = () => {
    setModalMode("create");
    setEditingIngredient(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const ingredientData = {
      ing_name: form.ing_name.value,
      ing_calories: parseFloat(form.ing_calories.value),
      ing_state: form.ing_state.value === "true"
    };
    try {
      if (modalMode === "edit" && editingIngredient) {
        await ingredientsApi.update(editingIngredient.ing_id, ingredientData);
      } else {
        await ingredientsApi.create(ingredientData);
      }
      const response = await ingredientsApi.getAll();
      setIngredients(response.data || response);
      setModalOpen(false);
    } catch (err) {
      alert('Error al guardar el ingrediente');
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
      try {
        await ingredientsApi.delete(id);
        setIngredients(ingredients.filter(ingredient => ingredient.ing_id !== id));
      } catch (err) {
        alert('Error al eliminar el ingrediente');
        console.error('Error:', err);
      }
    }
  };

  const handleEdit = (ingredient) => {
    setModalMode("edit");
    setEditingIngredient(ingredient);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mis Ingredientes</h1>
            <button
              className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={handleOpenModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Nuevo Ingrediente
            </button>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Listado de Ingredientes
            </h2>
            <IngredientTable ingredients={ingredients} loading={loading} error={error} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </main>
        <IngredientModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} ingredient={editingIngredient} mode={modalMode} />
      </div>
    </div>
  );
};

export default IngredientsPage;
