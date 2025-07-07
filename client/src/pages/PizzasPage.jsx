import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import PizzaTable from "../components/PizzaTable";
import PizzaModal from "../components/PizzaModal";
import { pizzasApi } from "../api/pizzas";

const PizzasPage = ({ onNavigate, currentPage }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [editingPizza, setEditingPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener pizzas al cargar
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const response = await pizzasApi.getAll();
        setPizzas(response.data || response);
      } catch (err) {
        setError('Error al cargar las pizzas');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const handleOpenModal = () => {
    setModalMode("create");
    setEditingPizza(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  // Registro real
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const pizzaData = {
      piz_name: form.piz_name.value,
      piz_origin: form.piz_origin.value,
      piz_state: form.piz_state.value === "true"
    };
    try {
      if (modalMode === "edit" && editingPizza) {
        await pizzasApi.update(editingPizza.piz_id, pizzaData);
      } else {
        await pizzasApi.create(pizzaData);
      }
      // Refrescar lista
      const response = await pizzasApi.getAll();
      setPizzas(response.data || response);
      setModalOpen(false);
    } catch (err) {
      alert('Error al guardar la pizza');
      console.error('Error:', err);
    }
  };

  // Eliminar pizza (para pasar a la tabla)
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pizza?')) {
      try {
        await pizzasApi.delete(id);
        setPizzas(pizzas.filter(pizza => pizza.piz_id !== id));
      } catch (err) {
        alert('Error al eliminar la pizza');
        console.error('Error:', err);
      }
    }
  };

  // Editar pizza: abrir modal y cargar datos
  const handleEdit = (pizza) => {
    setModalMode("edit");
    setEditingPizza(pizza);
    setModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Contenido Principal */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-8">
          {/* Encabezado de la página */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Mis Pizzas</h1>
            <button
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={handleOpenModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Nueva Pizza
            </button>
          </div>
          {/* Sección Tabla/Listado */}
          <div>
            <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Listado de Pizzas
            </h2>
            <PizzaTable pizzas={pizzas} loading={loading} error={error} onDelete={handleDelete} onEdit={handleEdit} />
          </div>
        </main>
        <PizzaModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} pizza={editingPizza} mode={modalMode} />
      </div>
    </div>
  );
};

export default PizzasPage;