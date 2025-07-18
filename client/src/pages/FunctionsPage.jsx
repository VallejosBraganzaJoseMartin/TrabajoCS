import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FunctionsTable from "../components/FunctionsTable";
import FunctionModal from "../components/FunctionModal";
import { functionsApi } from "../api/functions";

const FunctionsPage = () => {
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedFunction, setSelectedFunction] = useState(null);

  const fetchFunctions = async () => {
    try {
      setLoading(true);
      const data = await functionsApi.getAll();
      // Mapear campos del backend al frontend
      const mappedFunctions = data.map(func => ({
        id: func.funcion_id,
        name: func.funcion_name,
        description: func.funcion_descripcion,
        state: func.funcion_state
      }));
      setFunctions(mappedFunctions);
    } catch (err) {
      setError("Error al cargar las funciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  // Abrir modal para crear
  const handleAddFunction = () => {
    setSelectedFunction(null);
    setModalMode("create");
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditFunction = (func) => {
    setSelectedFunction(func);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Manejar submit del modal
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.funcion_name.value.trim();
    const description = form.funcion_descripcion.value.trim();
    const state = form.funcion_state.checked;

    try {
      if (modalMode === "create") {
        await functionsApi.create({ name, description, state });
      } else if (modalMode === "edit" && selectedFunction) {
        await functionsApi.update(selectedFunction.id, { name, description, state });
      }
      setModalOpen(false);
      fetchFunctions(); // Recargar datos desde el servidor
    } catch (err) {
      alert("Error al guardar la función");
    }
  };

  // Eliminar función
  const handleDeleteFunction = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta función?')) {
      try {
        await functionsApi.delete(id);
        fetchFunctions(); // Recargar datos desde el servidor
      } catch (err) {
        alert('Error al eliminar la función');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Funciones del Sistema</h1>
            <button
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={handleAddFunction}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Nueva Función
            </button>
          </div>
          <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Listado de Funciones
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <FunctionsTable 
              functions={functions} 
              loading={loading} 
              error={error}
              onEdit={handleEditFunction}
              onDelete={handleDeleteFunction}
            />
          </div>
        </main>
        <FunctionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          func={selectedFunction}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default FunctionsPage;
