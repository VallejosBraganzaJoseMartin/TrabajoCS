import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import PizzasPage from './pages/PizzasPage';
import IngredientsPage from './pages/IngredientsPage';
import MenuPage from './pages/MenuPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import FuncionesPage from './pages/FuncionesPage';
import ManagePizzaIngredients from './components/ManagePizzaIngredients';
import LoginPage from './pages/LoginPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedFunctionRoute from './components/ProtectedFunctionRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/acceso-denegado" element={<AccessDeniedPage />} />
            <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
              <Route path="/" element={<Navigate to="/menu" replace />} />
              
              {/* Ruta accesible para todos los usuarios autenticados */}
              <Route path="/menu" element={<MenuPage />} />
              
              {/* Rutas protegidas por permisos */}
              <Route path="/pizzas" element={
                <ProtectedFunctionRoute requiredFunctions={['ver_pizzas', 'gestionar_pizzas']}>
                  <PizzasPage />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="/ingredientes" element={
                <ProtectedFunctionRoute requiredFunctions={['ver_ingredientes', 'gestionar_ingredientes']}>
                  <IngredientsPage />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="/usuarios" element={
                <ProtectedFunctionRoute requiredFunctions={['gestionar_usuarios', 'ver_usuarios']}>
                  <UsersPage />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="/roles" element={
                <ProtectedFunctionRoute requiredFunctions={['gestionar_roles']}>
                  <RolesPage />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="/funciones" element={
                <ProtectedFunctionRoute requiredFunctions={['gestionar_funciones']}>
                  <FuncionesPage />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="/pizzas/:id/ingredientes" element={
                <ProtectedFunctionRoute requiredFunctions={['gestionar_pizzas']}>
                  <ManagePizzaIngredients />
                </ProtectedFunctionRoute>
              } />
              
              <Route path="*" element={<Navigate to="/menu" replace />} />
            </Route>
          </Routes>
        </Router>
      </PermissionProvider>
    </AuthProvider>
  );
}

export default App;