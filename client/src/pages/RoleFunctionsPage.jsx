import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { rolesFunctionsApi } from "../api/rolesFunctions";
import { functionsApi } from "../api/functions";
import { rolesApi } from "../api/roles";

const RoleFunctionsPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [assignedFunctions, setAssignedFunctions] = useState([]);
  const [availableFunctions, setAvailableFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener información del rol
      try {
        const roleData = await rolesApi.getAll();
        const currentRole = roleData.find(role => role.id === parseInt(roleId));
        setRoleName(currentRole ? currentRole.name : "Rol desconocido");
      } catch (err) {
        console.error("Error al obtener roles:", err);
        setRoleName("Rol desconocido");
      }
      
      // Obtener todas las funciones
      let mappedAllFunctions = [];
      try {
        const allFunctions = await functionsApi.getAll();
        mappedAllFunctions = allFunctions.map(func => ({
          id: func.funcion_id,
          name: func.funcion_name,
          description: func.funcion_descripcion,
          state: func.funcion_state
        }));
      } catch (err) {
        console.error("Error al obtener funciones:", err);
      }

      // Obtener funciones asignadas al rol
      let mappedRoleFunctions = [];
      try {
        const roleFunctions = await rolesFunctionsApi.getFunctionsByRole(roleId);
        mappedRoleFunctions = roleFunctions.map(func => ({
          id: func.funcion_id,
          name: func.funcion_name,
          description: func.funcion_descripcion,
          state: func.funcion_state
        }));
      } catch (err) {
        console.error("Error al obtener funciones del rol:", err);
        // Si falla, establecer array vacío (rol sin funciones asignadas)
        mappedRoleFunctions = [];
      }

      // Calcular funciones disponibles (no asignadas)
      const assignedIds = mappedRoleFunctions.map(f => f.id);
      const available = mappedAllFunctions.filter(f => !assignedIds.includes(f.id) && f.state);

      setAssignedFunctions(mappedRoleFunctions);
      setAvailableFunctions(available);
      
    } catch (err) {
      setError("Error al cargar los datos");
      console.error("Error general:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleId]);

  const handleAssignFunction = async (e) => {
    e.preventDefault();
    if (!selectedFunction) return;

    try {
      await rolesFunctionsApi.assignFunctionsToRole(roleId, [parseInt(selectedFunction)]);
      
      // Actualizar estados localmente para mejor UX
      const functionToAdd = availableFunctions.find(f => f.id === parseInt(selectedFunction));
      if (functionToAdd) {
        setAssignedFunctions([...assignedFunctions, functionToAdd]);
        setAvailableFunctions(availableFunctions.filter(f => f.id !== parseInt(selectedFunction)));
      }
      
      setSelectedFunction("");
    } catch (err) {
      alert("Error al asignar la función");
      // En caso de error, recargar datos para mantener consistencia
      fetchData();
    }
  };

  const handleRemoveFunction = async (functionId) => {
    if (window.confirm('¿Estás seguro de que quieres remover esta función del rol?')) {
      try {
        await rolesFunctionsApi.removeFunctionFromRole(roleId, functionId);
        
        // Actualizar estados localmente para mejor UX
        const functionToRemove = assignedFunctions.find(f => f.id === functionId);
        if (functionToRemove && functionToRemove.state) {
          setAssignedFunctions(assignedFunctions.filter(f => f.id !== functionId));
          setAvailableFunctions([...availableFunctions, functionToRemove]);
        } else {
          setAssignedFunctions(assignedFunctions.filter(f => f.id !== functionId));
        }
      } catch (err) {
        alert("Error al remover la función");
        // En caso de error, recargar datos para mantener consistencia
        fetchData();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Header />
          <main className="p-8">
            <div className="text-center">Cargando...</div>
          </main>
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
              Asignar Funciones: <span className="text-red-600">{roleName}</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Columna Izquierda: Funciones Asignadas */}
            <div className="lg:col-span-3">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Funciones Asignadas
              </h2>
              <div className="bg-white rounded-lg shadow-md">
                {assignedFunctions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No hay funciones asignadas a este rol
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {assignedFunctions.map((func) => (
                      <div key={func.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div>
                          <p className="font-semibold text-gray-800">{func.name}</p>
                          <p className="text-sm text-gray-500">{func.description}</p>
                        </div>
                        <button 
                          onClick={() => handleRemoveFunction(func.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Columna Derecha: Añadir Función */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-medium text-gray-600 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Añadir Nueva Función al Rol
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleAssignFunction} className="space-y-4">
                  <div>
                    <label htmlFor="function" className="block text-sm font-medium text-gray-700">
                      Función
                    </label>
                    <select 
                      id="function" 
                      value={selectedFunction}
                      onChange={(e) => setSelectedFunction(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                      required
                    >
                      <option value="">Selecciona una función...</option>
                      {availableFunctions.map((func) => (
                        <option key={func.id} value={func.id}>
                          {func.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-right pt-2">
                    <button 
                      type="submit" 
                      disabled={!selectedFunction}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Asignar Función
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

export default RoleFunctionsPage;
