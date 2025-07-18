import React from "react";

const RolesTable = ({ roles, loading, error, onEdit, onDelete, onManageFunctions }) => (
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
                <button className="text-gray-400 hover:text-green-600" onClick={() => onManageFunctions && onManageFunctions(role)} title="Gestionar funciones"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></button>
                <button className="text-gray-400 hover:text-red-600" onClick={() => onDelete && onDelete(role.id)} title="Eliminar rol"><svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default RolesTable;
