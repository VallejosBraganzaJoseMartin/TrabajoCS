import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PizzasPage from './pages/PizzasPage';
import IngredientsPage from './pages/IngredientsPage';
import MenuPage from './pages/MenuPage';
import UsersPage from './pages/UsersPage';
import ManagePizzaIngredients from './components/ManagePizzaIngredients';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RolesPage from './pages/RolesPage';
import FunctionsPage from './pages/FunctionsPage';
import RoleFunctionsPage from './pages/RoleFunctionsPage';
import UserRolesPage from './pages/UserRolesPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route 
              path="/pizzas" 
              element={
                <ProtectedRoute requiredFunction="Administrar Pizzas">
                  <PizzasPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/menu" element={<MenuPage />} />
            <Route 
              path="/ingredientes" 
              element={
                <ProtectedRoute requiredFunction="Administrar Pizzas">
                  <IngredientsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gestion" 
              element={
                <ProtectedRoute requiredFunction="Administrar Usuarios">
                  <UsersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pizzas/:id/ingredientes" 
              element={
                <ProtectedRoute requiredFunction="Administrar Pizzas">
                  <ManagePizzaIngredients />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute requiredFunction="Administrar Roles">
                  <RolesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles/:roleId/functions" 
              element={
                <ProtectedRoute requiredFunction="Administrar Roles">
                  <RoleFunctionsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users/:userId/roles" 
              element={
                <ProtectedRoute requiredFunction="Administrar Usuarios">
                  <UserRolesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/funciones" 
              element={
                <ProtectedRoute requiredFunction="Administrar Funciones">
                  <FunctionsPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/menu" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
