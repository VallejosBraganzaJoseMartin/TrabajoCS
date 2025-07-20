import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { permissionsApi } from '../api/permissions';
const PermissionContext = createContext();

export function PermissionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [userFunctions, setUserFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFunctions = async () => {
      if (isAuthenticated && user) {
        try {
          console.log('Usuario autenticado:', user);
          // Inicializamos un array vacío para las funciones
          let functions = [];

          if (user.roles) {
            console.log('Roles del usuario:', user.roles);
            
            // Obtener las funciones de cada rol desde el backend
            for (const role of user.roles) {
              const roleId = role.id || role.role_id;
              try {
                const response = await permissionsApi.getRoleFunctions(roleId);
                const roleFunctions = response.data || [];
                
                // Mapear las funciones del rol a nombres de función
                roleFunctions.forEach(func => {
                  const functionName = func.funcion_name;
                  if (functionName) {
                    functions.push(functionName);
                  }
                });
              } catch (error) {
                console.error(`Error al obtener funciones del rol ${roleId}:`, error);
                
                // Fallback a la asignación estática si hay un error
                const roleName = role.name || role.role_name;
                console.log('Usando asignación estática para el rol:', roleName);
                
                if (roleName === 'Administrador') {
                  functions.push(
                    'gestionar_usuarios', 'ver_usuarios', 'gestionar_roles', 'gestionar_funciones',
                    'gestionar_pizzas', 'ver_pizzas', 'gestionar_ingredientes', 'ver_ingredientes'
                  );
                } else if (roleName === 'Gerente') {
                  functions.push(
                    'ver_usuarios', 'gestionar_pizzas', 'ver_pizzas',
                    'gestionar_ingredientes', 'ver_ingredientes'
                  );
                } else if (roleName === 'Empleado') {
                  functions.push('ver_pizzas', 'ver_ingredientes');
                }
              }
            }
          }
         
          
          // Eliminar duplicados
          functions = [...new Set(functions)];
          setUserFunctions(functions);
        } catch (error) {
          console.error('Error al cargar funciones del usuario:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setUserFunctions([]);
        setLoading(false);
      }
    };

    loadUserFunctions();
  }, [isAuthenticated, user]);

  // Verificar si el usuario tiene una función específica
  const hasFunction = (functionName) => {
    return userFunctions.includes(functionName);
  };

  // Verificar si el usuario tiene al menos una de las funciones especificadas
  const hasAnyFunction = (functionNames) => {
    return functionNames.some(fn => userFunctions.includes(fn));
  };

  // Verificar si el usuario tiene todas las funciones especificadas
  const hasAllFunctions = (functionNames) => {
    return functionNames.every(fn => userFunctions.includes(fn));
  };

  return (
    <PermissionContext.Provider value={{ 
      userFunctions, 
      hasFunction, 
      hasAnyFunction, 
      hasAllFunctions, 
      loading 
    }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  return useContext(PermissionContext);
}