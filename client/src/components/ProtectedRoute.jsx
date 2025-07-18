import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../hooks/usePermissions';

export default function ProtectedRoute({ 
  children, 
  requiredFunction = null,
  requiredFunctions = null,
  requireAll = false,
  fallbackPath = '/menu'
}) {
  const { isAuthenticated, loading } = useAuth();
  const { hasFunction, hasAnyFunction, hasAllFunctions } = usePermissions();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no se requieren funciones específicas, permitir acceso
  if (!requiredFunction && !requiredFunctions) {
    return children;
  }

  // Verificar función única
  if (requiredFunction && !hasFunction(requiredFunction)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Verificar múltiples funciones
  if (requiredFunctions) {
    const hasPermission = requireAll 
      ? hasAllFunctions(requiredFunctions)
      : hasAnyFunction(requiredFunctions);
    
    if (!hasPermission) {
      return <Navigate to={fallbackPath} replace />;
    }
  }

  return children;
}
