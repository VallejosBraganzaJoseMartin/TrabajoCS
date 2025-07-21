import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NoRoleMessage from './NoRoleMessage';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null; // O un spinner si prefieres
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Verificar si el usuario tiene roles asignados
  const hasRoles = user && user.roles && user.roles.length > 0;
  if (!hasRoles) return <NoRoleMessage />;
  
  return children;
}
