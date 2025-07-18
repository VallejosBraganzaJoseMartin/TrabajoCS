import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { rolesApi } from "../api/roles";
import RolesTable from "../components/RolesTable";
import RoleModal from "../components/RoleModal";

const RolesPage = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRole, setSelectedRole] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch (err) {
      setError("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Abrir modal para crear
  const handleAddRole = () => {
    setSelectedRole(null);
    setModalMode("create");
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Manejar submit del modal
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.role_name.value.trim();
    const descripcion = form.role_descripcion.value.trim();
    const state = form.role_state.checked;
    try {
      if (modalMode === "create") {
        await rolesApi.create({ name, descripcion, state });
      } else if (modalMode === "edit" && selectedRole) {
        await rolesApi.update(selectedRole.id, { name, descripcion, state });
      }
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      alert("Error al guardar el rol");
    }
  };

  // Eliminar rol
  const handleDeleteRole = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      try {
        await rolesApi.delete(id);
        fetchRoles();
      } catch (err) {
        alert('Error al eliminar el rol');
      }
    }
  };

  // Manejar funciones del rol
  const handleManageFunctions = (role) => {
    navigate(`/roles/${role.id}/functions`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Roles del Sistema</h1>
            <button
              className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={handleAddRole}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Añadir Nuevo Rol
            </button>
          </div>
          <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Listado de Roles
          </h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <RolesTable 
              roles={roles} 
              loading={loading} 
              error={error} 
              onEdit={handleEditRole} 
              onDelete={handleDeleteRole}
              onManageFunctions={handleManageFunctions}
            />
          </div>
        </main>
        <RoleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          role={selectedRole}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default RolesPage;
