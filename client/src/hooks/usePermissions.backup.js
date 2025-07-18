import { useAuth } from '../contexts/AuthContext';

// Hook personalizado para verificar permisos basados en funciones
export const usePermissions = () => {
  const { user, loading } = useAuth();

  // Verificar si el usuario tiene una función específica
  const hasFunction = (functionName) => {
    // Si está cargando o no hay usuario, devolver false por defecto
    if (loading || !user) {
      return false;
    }
    
    // Verificar si user.funciones existe y es un array
    if (user.funciones && Array.isArray(user.funciones)) {
      return user.funciones.some(funcion => 
        funcion.nombre === functionName || 
        funcion.funcion_name === functionName ||
        funcion.func_name === functionName
      );
    }
    
    // Si no tiene funciones, retornar false
    return false;
  };

  // Verificar múltiples funciones (OR - al menos una)
  const hasAnyFunction = (functionNames) => {
    if (!Array.isArray(functionNames)) return hasFunction(functionNames);
    return functionNames.some(funcName => hasFunction(funcName));
  };

  // Verificar múltiples funciones (AND - todas)
  const hasAllFunctions = (functionNames) => {
    if (!Array.isArray(functionNames)) return hasFunction(functionNames);
    return functionNames.every(funcName => hasFunction(funcName));
  };

  // Obtener todas las funciones del usuario
  const getUserFunctions = () => {
    return user?.funciones || [];
  };

  // ===== FUNCIONES ESPECÍFICAS POR MÓDULO =====

  // PIZZAS - Administrar Pizzas
  const canManagePizzas = () => hasFunction("Administrar Pizzas");
  const canCreatePizza = () => hasFunction("Administrar Pizzas");
  const canEditPizza = () => hasFunction("Administrar Pizzas");
  const canDeletePizza = () => hasFunction("Administrar Pizzas");
  const canManagePizzaIngredients = () => hasFunction("Administrar Pizzas");

  // INGREDIENTES - Necesita Administrar Pizzas para gestionar ingredientes
  const canAccessIngredientsPage = () => hasFunction("Administrar Pizzas");
  const canCreateIngredient = () => hasFunction("Administrar Pizzas");
  const canEditIngredient = () => hasFunction("Administrar Pizzas");
  const canDeleteIngredient = () => hasFunction("Administrar Pizzas");

  // USUARIOS - Administrar Usuarios
  const canAccessUsersPage = () => hasFunction("Administrar Usuarios");
  const canCreateUser = () => hasFunction("Administrar Usuarios");
  const canEditUser = () => hasFunction("Administrar Usuarios");
  const canDeleteUser = () => hasFunction("Administrar Usuarios");
  const canManageUserRoles = () => hasFunction("Administrar Usuarios");

  // ROLES - Administrar Roles
  const canAccessRolesPage = () => hasFunction("Administrar Roles");
  const canCreateRole = () => hasFunction("Administrar Roles");
  const canEditRole = () => hasFunction("Administrar Roles");
  const canDeleteRole = () => hasFunction("Administrar Roles");
  const canManageRoleFunctions = () => hasFunction("Administrar Roles");

  // FUNCIONES - Administrar Funciones
  const canAccessFunctionsPage = () => hasFunction("Administrar Funciones");
  const canCreateFunction = () => hasFunction("Administrar Funciones");
  const canEditFunction = () => hasFunction("Administrar Funciones");
  const canDeleteFunction = () => hasFunction("Administrar Funciones");

  // ===== FUNCIONES DE ACCESO A PÁGINAS =====
  const canAccessPizzasPage = () => true; // Página pública
  const canAccessMenuPage = () => true; // Página pública

  return {
    // Funciones base
    hasFunction,
    hasAllFunctions,
    hasAnyFunction,
    getUserFunctions,

    // Pizzas
    canManagePizzas,
    canCreatePizza,
    canEditPizza,
    canDeletePizza,
    canManagePizzaIngredients,

    // Ingredientes
    canAccessIngredientsPage,
    canCreateIngredient,
    canEditIngredient,
    canDeleteIngredient,

    // Usuarios
    canAccessUsersPage,
    canCreateUser,
    canEditUser,
    canDeleteUser,
    canManageUserRoles,

    // Roles
    canAccessRolesPage,
    canCreateRole,
    canEditRole,
    canDeleteRole,
    canManageRoleFunctions,

    // Funciones
    canAccessFunctionsPage,
    canCreateFunction,
    canEditFunction,
    canDeleteFunction,

    // Páginas públicas
    canAccessPizzasPage,
    canAccessMenuPage,
  };
};
