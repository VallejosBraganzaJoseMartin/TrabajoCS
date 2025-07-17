import React from "react";

const RolesTable = ({ roles, loading, error, onEdit }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-[#f5f5f4]">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre del Rol</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {loading ? (
          <tr><td colSpan={5} className="text-center p-4 text-gray-400">Cargando...</td></tr>
        ) : error ? (
          <tr><td colSpan={5} className="text-center p-4 text-red-400">{error}</td></tr>
        ) : roles.length === 0 ? (
          <tr><td colSpan={5} className="text-center p-4 text-gray-400">No hay roles registrados</td></tr>
        ) : (
          roles.map(role => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{role.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-sm truncate">{role.descripcion}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${role.state ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{role.state ? 'Activo' : 'Inactivo'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3">
                <button className="text-gray-400 hover:text-blue-600" onClick={() => onEdit && onEdit(role)} title="Editar rol"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                <button className="text-gray-400 hover:text-red-600"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default RolesTable;
