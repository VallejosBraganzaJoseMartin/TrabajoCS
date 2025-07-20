import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermission } from '../contexts/PermissionContext';

const ProtectedFunctionRoute = ({ children, requiredFunctions, requireAll = false }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  // Verificar si el usuario tiene los permisos necesarios
  const hasPermission = requireAll 
    ? hasAllFunctions(requiredFunctions)
    : hasAnyFunction(requiredFunctions);

  console.log('ProtectedFunctionRoute - hasPermission:', hasPermission);

  if (!hasPermission) {
    // Redirigir a una página de acceso denegado si no tiene permisos
    console.log('Usuario sin permisos, redirigiendo a /acceso-denegado');
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Si tiene permisos, mostrar el contenido protegido
  console.log('Usuario con permisos, mostrando contenido');
  return children;
};

export default ProtectedFunctionRoute;