import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import UserModal from '../components/UserModal';
import UserTable from '../components/UserTable';
import AssignRoleModal from '../components/AssignRoleModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { usersApi } from '../api/users';
import { rolesApi } from '../api/roles';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null); // Limpiar errores anteriores
      
      // Cargar roles primero
      let rolesData = [];
      try {
        rolesData = await rolesApi.getAll();
        setRoles(Array.isArray(rolesData) ? rolesData : []);
      } catch (roleErr) {
        console.error('Error al cargar roles:', roleErr);
        setError('Error al cargar roles: ' + (roleErr.message || 'Error desconocido'));
        setLoading(false);
        return;
      }
      
      // Luego cargar usuarios
      try {
        const usersData = await usersApi.getAll();
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (userErr) {
        console.error('Error al cargar usuarios:', userErr);
        setError('Error al cargar usuarios: ' + (userErr.message || 'Error desconocido'));
      }
    } catch (err) {
      console.error('Error general al cargar datos:', err);
      setError('Error al cargar los datos: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Abrir modal de confirmación
  const openConfirmModal = (id, name) => {
    const user = users.find(u => (u.id === id || u.user_id === id));
    const userName = user ? `${user.firstName || user.user_names || ''} ${user.lastName || user.user_surenames || ''}`.trim() : 'este usuario';
    
    // Verificar si el usuario es administrador
    const isAdmin = user && user.roles && user.roles.some(role => 
      role.name === 'Administrador' || role.role_name === 'Administrador'
    );
    
    // Contar cuántos administradores hay en total
    const adminCount = users.filter(u => 
      u.roles && u.roles.some(role => 
        role.name === 'Administrador' || role.role_name === 'Administrador'
      )
    ).length;
    
    let warningMessage = null;
    
    if (isAdmin) {
      if (adminCount === 1) {
        warningMessage = 'Este usuario es el único administrador del sistema. Si lo eliminas, nadie podrá gestionar el sistema. Esta acción está bloqueada.';
      } else {
        warningMessage = 'Este usuario tiene rol de administrador. Asegúrate de que haya otro administrador activo en el sistema antes de eliminarlo.';
      }
    }
    
    setConfirmModal({
      isOpen: true,
      id,
      name: userName,
      isAdmin,
      adminCount,
      warningMessage
    });
  };

  // Cerrar modal de confirmación
  const closeConfirmModal = () => {
    setConfirmModal({
      isOpen: false,
      id: null,
      name: ''
    });
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    try {
      await usersApi.delete(confirmModal.id);
      await loadData(); // Recargar la lista
      closeConfirmModal();
    } catch (err) {
      console.error('Error deleting user:', err);
      
      // Verificar si es el error de último administrador
      if (err.response?.data?.message?.includes('último administrador')) {
        setError(
          err.response.data.details || 
          'No se puede eliminar al último administrador activo. Debe haber al menos un administrador en el sistema.'
        );
      } else {
        setError('Error al eliminar el usuario: ' + (err.response?.data?.message || err.message || 'Error desconocido'));
      }
      
      closeConfirmModal();
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === 'create') {
        await usersApi.create(userData);
      } else {
        await usersApi.update(selectedUser.id, userData);
      }
      setIsModalOpen(false);
      await loadData(); // Recargar la lista
    } catch (err) {
      console.error('Error saving user:', err);
      throw err; // Para que el modal maneje el error
    }
  };

  const getRoleName = (roleId) => {
    if (!roleId) return 'Sin rol';
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Sin rol';
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Activo
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Inactivo
        </span>
      );
    }
  };

  if (loading) {
    return (
      <Layout title="Usuarios">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          <div className="ml-4 text-lg text-gray-600">Cargando usuarios...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    // Verificar si es el mensaje específico del último administrador
    const isLastAdminError = error.includes('último administrador') || 
                            error.includes('Esta acción está bloqueada') || 
                            error.includes('nadie podrá gestionar');
    
    return (
      <Layout title="Usuarios">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => setError(null)}
            className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Usuarios
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Usuarios">
      {/* Header con título y botón */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Usuarios del Sistema</h1>
        <button 
          onClick={handleCreateUser}
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Añadir Nuevo Usuario
        </button>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Listado de Usuarios
        </h2>
        
        <div className="overflow-x-auto">
          <UserTable
            users={users}
            getRoleName={getRoleName}
            getStatusBadge={getStatusBadge}
            onEdit={handleEditUser}
            onDelete={openConfirmModal}
            onAssignRoles={(user) => {
              setSelectedUser(user);
              setIsRoleModalOpen(true);
            }}
          />
        </div>
      </div>

      {/* Modal para crear/editar usuarios */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          roles={roles}
          mode={modalMode}
        />
      )}
      
      {/* Modal para asignar roles */}
      {isRoleModalOpen && (
        <AssignRoleModal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          onSave={async (selectedRoles) => {
            try {
              // Llamar al API para asignar roles al usuario
              await usersApi.assignRoles(selectedUser.id, selectedRoles);
              setIsRoleModalOpen(false);
              await loadData(); // Recargar la lista
            } catch (err) {
              console.error('Error al asignar roles:', err);
              setError('Error al asignar roles al usuario: ' + (err.message || 'Error desconocido'));
            }
          }}
          user={selectedUser}
          availableRoles={roles}
        />
      )}
      
      {/* Modal de confirmación para eliminar */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar a ${confirmModal.name}? Esta acción no se puede deshacer.`}
        warningMessage={confirmModal.warningMessage}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </Layout>
  );
};

export default UsersPage;