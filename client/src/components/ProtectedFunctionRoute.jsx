import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../contexts/PermissionContext';
import NoRoleMessage from './NoRoleMessage';

const ProtectedFunctionRoute = ({ children, requiredFunctions, requireAll = false }) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { hasAnyFunction, hasAllFunctions, userFunctions, loading: permissionLoading } = usePermission();

  console.log('ProtectedFunctionRoute - requiredFunctions:', requiredFunctions);
  console.log('ProtectedFunctionRoute - userFunctions:', userFunctions);
  console.log('ProtectedFunctionRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedFunctionRoute - loading:', authLoading, permissionLoading);

  if (authLoading || permissionLoading) {
    // Mostrar un indicador de carga mientras se verifican los permisos
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login si el usuario no está autenticado
    console.log('Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }
  
  // Verificar si el usuario tiene roles asignados
  const hasRoles = user && user.roles && user.roles.length > 0;
  if (!hasRoles) {
    console.log('Usuario sin roles asignados');
    return <NoRoleMessage />;
  }

  // Verificar si el usuario tiene los permisos necesarios
  const hasPermission = requireAll 
    ? hasAllFunctions(requiredFunctions)
    : hasAnyFunction(requiredFunctions);

  console.log('ProtectedFunctionRoute - hasPermission:', hasPermission);

  if (!hasPermission) {
    // Determinar a dónde redirigir al usuario basado en sus permisos
    let redirectPath = '/acceso-denegado';
    
    if (hasAnyFunction(['ver_menu'])) {
      redirectPath = '/menu';
    } else if (hasAnyFunction(['ver_pizzas', 'gestionar_pizzas'])) {
      redirectPath = '/pizzas';
    } else if (hasAnyFunction(['ver_ingredientes', 'gestionar_ingredientes'])) {
      redirectPath = '/ingredientes';
    } else if (hasAnyFunction(['gestionar_usuarios', 'ver_usuarios'])) {
      redirectPath = '/usuarios';
    } else if (hasAnyFunction(['gestionar_roles'])) {
      redirectPath = '/roles';
    } else if (hasAnyFunction(['gestionar_funciones'])) {
      redirectPath = '/funciones';
    }
    
    console.log(`Usuario sin permisos para ${requiredFunctions.join(', ')}, redirigiendo a ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Si tiene permisos, mostrar el contenido protegido
  console.log('Usuario con permisos, mostrando contenido');
  return children;
};

export default ProtectedFunctionRoute;