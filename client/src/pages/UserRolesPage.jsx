import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { userRolesApi } from '../api/userRoles';
import { rolesApi } from '../api/roles';
import { usersApi } from '../api/users';

const UserRolesPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [userResponse, userRolesResponse, rolesResponse] = await Promise.all([
        usersApi.getById(userId),
        userRolesApi.getRolesByUser(userId),
        rolesApi.getAll()
      ]);

      // ...
      setUser(userResponse);
      
      // Mapear roles del usuario
      const mappedUserRoles = Array.isArray(userRolesResponse) ? userRolesResponse.map(role => ({
        id: role.role_id || role.id,
        name: role.role_name || role.name,
        descripcion: role.role_descripcion || role.descripcion,
        state: role.role_state !== undefined ? role.role_state : role.state
      })) : [];
      
      // Mapear todos los roles disponibles
      const mappedAllRoles = Array.isArray(rolesResponse) ? rolesResponse.map(role => ({
        id: role.id,
        name: role.name,
        descripcion: role.descripcion,
        state: role.state
      })) : [];

      // ...

      // Calcular roles disponibles (no asignados)
      const assignedIds = mappedUserRoles.map(r => r.id);
      const available = mappedAllRoles.filter(r => !assignedIds.includes(r.id) && r.state);

      setUserRoles(mappedUserRoles);
      setAvailableRoles(available);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setIsAssigning(true);
      await userRolesApi.assignRolesToUser(userId, [parseInt(selectedRole)]);
      
      // Actualizar estados localmente para mejor UX
      const roleToAdd = availableRoles.find(role => role.id === parseInt(selectedRole));
      if (roleToAdd) {
        setUserRoles([...userRoles, roleToAdd]);
        setAvailableRoles(availableRoles.filter(role => role.id !== parseInt(selectedRole)));
      }
      
      setSelectedRole('');
    } catch (err) {
      console.error('Error assigning role:', err);
      setError('Error al asignar rol');
      // En caso de error, recargar datos para mantener consistencia
      loadData();
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveRole = async (roleId) => {
    if (window.confirm('¿Estás seguro de que quieres remover este rol del usuario?')) {
      try {
        await userRolesApi.removeRoleFromUser(userId, roleId);
        
        // Actualizar estados localmente para mejor UX
        const roleToRemove = userRoles.find(role => role.id === roleId);
        if (roleToRemove && roleToRemove.state) {
          setUserRoles(userRoles.filter(role => role.id !== roleId));
          setAvailableRoles([...availableRoles, roleToRemove]);
        } else {
          setUserRoles(userRoles.filter(role => role.id !== roleId));
        }
      } catch (err) {
        console.error('Error removing role:', err);
        setError('Error al remover rol');
        // En caso de error, recargar datos para mantener consistencia
        loadData();
      }
    }
  };

  const getUserName = () => {
    if (!user) return 'Usuario';
    return `${user.firstName || user.user_names || ''} ${user.lastName || user.user_surenames || ''}`.trim() || user.email || user.user_email || 'Usuario';
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Asignar Rol a: <span className="text-red-600">{getUserName()}</span>
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Columna Izquierda: Roles Actuales */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Roles Actuales
              </h2>
              <div className="bg-white rounded-lg shadow-md">
                <div className="divide-y divide-gray-200">
                  {userRoles.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Este usuario no tiene roles asignados.
                    </div>
                  ) : (
                    userRoles.map((role) => (
                      <div key={role.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{role.name}</p>
                          <p className="text-sm text-gray-500">{role.descripcion}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveRole(role.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Remover rol"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Asignar Nuevo Rol */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Añadir Nuevo Rol al Usuario
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleAssignRole} className="space-y-4">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <select 
                      id="role" 
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Selecciona un rol...</option>
                      {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-right pt-2">
                    <button 
                      type="submit" 
                      disabled={!selectedRole || isAssigning}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAssigning ? 'Asignando...' : 'Asignar Rol'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserRolesPage;
