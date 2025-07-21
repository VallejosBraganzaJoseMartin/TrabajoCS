import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import PizzaTable from "../components/PizzaTable";
import PizzaModal from "../components/PizzaModal";
import ConfirmationModal from "../components/ConfirmationModal";
import ErrorModal from "../components/ErrorModal";
import { pizzasApi } from "../api/pizzas";

const PizzasPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); 
  const [editingPizza, setEditingPizza] = useState(null);
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: ''
  });
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

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
      piz_state: form.piz_state.value === "true",
      url_image: form.url_image.value
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
      console.error('Error:', err);
      
      // Mostrar mensaje de error en modal
      let errorMessage = 'Error al guardar la pizza';
      let errorDetails = '';
      
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
        if (err.response.data.details) {
          errorDetails = err.response.data.details;
        }
      }
      
      setErrorModal({
        isOpen: true,
        title: '¡Error al guardar!',
        message: errorMessage,
        details: errorDetails
      });
    }
  };

  const openConfirmModal = (id, name) => {
    setConfirmModal({
      isOpen: true,
      id,
      name
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      id: null,
      name: ''
    });
  };


  const handleDelete = async () => {
    try {
      await pizzasApi.delete(confirmModal.id);
      setPizzas(pizzas.filter(pizza => pizza.piz_id !== confirmModal.id));
      closeConfirmModal();
    } catch (err) {
      setError('Error al eliminar la pizza');
      console.error('Error:', err);
      closeConfirmModal();
    }
  };

  const handleEdit = (pizza) => {
    setModalMode("edit");
    setEditingPizza(pizza);
    setModalOpen(true);
  };

  return (
    <Layout title="Pizzas">
      {/* Encabezado de la página */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Mis Pizzas</h1>
        <button
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          onClick={handleOpenModal}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir Nueva Pizza
        </button>
      </div>
      
      {/* Sección Tabla/Listado */}
      <div className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Listado de Pizzas
        </h2>
        <div className="overflow-x-auto">
          <PizzaTable
            pizzas={pizzas}
            loading={loading}
            error={error}
            onDelete={openConfirmModal}
            onEdit={handleEdit}
          />
        </div>
      </div>
      
      <PizzaModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} pizza={editingPizza} mode={modalMode} />
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title="Eliminar Pizza"
        message={`¿Estás seguro de que deseas eliminar la pizza "${confirmModal.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({...errorModal, isOpen: false})}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </Layout>
  );
};

export default PizzasPage;