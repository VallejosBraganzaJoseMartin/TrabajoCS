import React, { useState, useEffect } from 'react';
import { rolesApi } from '../api/roles';
import { funcionesApi } from '../api/funciones';
import { permissionsApi } from '../api/permissions';
import RoleTable from '../components/RoleTable';
import RoleModal from '../components/RoleModal';
import AssignFunctionModal from '../components/AssignFunctionModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Layout from '../components/Layout';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [funciones, setFunciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFunctionModalOpen, setIsFunctionModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      await fetchRoles();
      await fetchFunciones();
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchFunciones = async () => {
    try {
      const data = await funcionesApi.getAll();
      setFunciones(data);
    } catch (err) {
      console.error('Error al cargar funciones:', err);
      setError('Error al cargar las funciones. Por favor, intenta de nuevo.');
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar roles:', err);
      setError('Error al cargar los roles. Por favor, intenta de nuevo.');
    }
  };

  const handleOpenModal = (role = null) => {
    setCurrentRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRole(null);
  };

  const handleSaveRole = async (roleData) => {
    try {
      if (currentRole) {
        // Actualizar rol existente
        await rolesApi.update(currentRole.id, roleData);
      } else {
        // Crear nuevo rol
        await rolesApi.create(roleData);
      }
      fetchRoles();
      handleCloseModal();
    } catch (err) {
      console.error('Error al guardar rol:', err);
      setError('Error al guardar el rol. Por favor, intenta de nuevo.');
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

  const handleDeleteRole = async () => {
    try {
      await rolesApi.delete(confirmModal.id);
      fetchRoles();
      closeConfirmModal();
    } catch (err) {
      console.error('Error al eliminar rol:', err);
      setError('Error al eliminar el rol. Por favor, intenta de nuevo.');
      closeConfirmModal();
    }
  };

  return (
    <Layout title="Gestión de Roles">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Rol
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
            <RoleTable
              roles={roles}
              onEdit={handleOpenModal}
              onDelete={openConfirmModal}
              onAssignFunctions={(role) => {
                setCurrentRole(role);
                setIsFunctionModalOpen(true);
              }}
            />
          </div>
        )}
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRole}
        role={currentRole}
      />
      
      {/* Modal para asignar funciones */}
      {isFunctionModalOpen && (
        <AssignFunctionModal
          isOpen={isFunctionModalOpen}
          onClose={() => setIsFunctionModalOpen(false)}
          onSave={async (selectedFunctions) => {
            try {
              await permissionsApi.assignFunctionsToRole(currentRole.id, selectedFunctions);
              // Volver a cargar el rol actualizado desde el backend antes de cerrar el modal
              const updatedRole = await rolesApi.getById(currentRole.id);
              setCurrentRole(updatedRole);
              await fetchRoles(); // Recargar los roles con sus funciones actualizadas
              setIsFunctionModalOpen(false);
            } catch (err) {
              console.error('Error al asignar funciones:', err);
              setError('Error al asignar funciones al rol');
            }
          }}
          role={currentRole}
          availableFunctions={funciones}
        />
      )}
      
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteRole}
        title="Eliminar Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${confirmModal.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Layout>
  );
};

export default RolesPage;