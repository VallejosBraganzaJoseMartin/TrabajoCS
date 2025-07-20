import React from 'react';

const UserTable = ({ users, getRoleName, getStatusBadge, onEdit, onDelete, onAssignRoles }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombres</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Apellidos</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
          <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
              No hay usuarios registrados
            </td>
          </tr>
        ) : (
          users.map((user, idx) => (
            <tr key={user.id || user.user_id || idx} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.id || user.user_id || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.firstName || user.user_names || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.lastName || user.user_surenames || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.email || user.user_email || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {user.roles && user.roles.length > 0 
                  ? user.roles.map(role => role.name).join(', ')
                  : user.role 
                    ? user.role.name 
                    : 'Sin rol'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(
                  user.user_state !== undefined ? user.user_state : (user.isActive !== undefined ? user.isActive : user.user_status)
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="inline-flex space-x-3">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar usuario"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {/* Botón para asignar roles */}
                  <button
                    onClick={() => onAssignRoles && onAssignRoles(user)}
                    className="text-gray-400 hover:text-green-600 transition-colors"
                    title="Asignar roles"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(user.id || user.user_id, `${user.firstName || user.user_names || ''} ${user.lastName || user.user_surenames || ''}`.trim())}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Eliminar usuario"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default UserTable;