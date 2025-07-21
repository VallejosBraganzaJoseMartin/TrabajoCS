import React, { useState, useEffect } from 'react';
import { funcionesApi } from '../api/funciones';
import FuncionTable from '../components/FuncionTable';
import FuncionModal from '../components/FuncionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Layout from '../components/Layout';

const FuncionesPage = () => {
  const [funciones, setFunciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFuncion, setCurrentFuncion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchFunciones();
  }, []);

  const fetchFunciones = async () => {
    try {
      setLoading(true);
      const data = await funcionesApi.getAll();
      setFunciones(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar funciones:', err);
      setError('Error al cargar las funciones. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (funcion = null) => {
    setCurrentFuncion(funcion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFuncion(null);
  };

  const handleSaveFuncion = async (funcionData) => {
    try {
      if (currentFuncion) {
        // Actualizar función existente
        await funcionesApi.update(currentFuncion.id, funcionData);
      } else {
        // Crear nueva función
        await funcionesApi.create(funcionData);
      }
      fetchFunciones();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar función:', err);
      setError('Error al guardar la función. Por favor, intenta de nuevo.');
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

  const handleDeleteFuncion = async () => {
    try {
      await funcionesApi.delete(confirmModal.id);
      fetchFunciones();
      closeConfirmModal();
    } catch (err) {
      console.error('Error al eliminar función:', err);
      setError('Error al eliminar la función. Por favor, intenta de nuevo.');
      closeConfirmModal();
    }
  };

  return (
    <Layout title="Gestión de Funciones">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Funciones</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nueva Función
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <FuncionTable
              funciones={funciones}
              onEdit={handleOpenModal}
              onDelete={openConfirmModal}
            />
          </div>
        )}
      </div>

      <FuncionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFuncion}
        funcion={currentFuncion}
      />
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteFuncion}
        title="Eliminar Función"
        message={`¿Estás seguro de que deseas eliminar la función "${confirmModal.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Layout>
  );
};

export default FuncionesPage;