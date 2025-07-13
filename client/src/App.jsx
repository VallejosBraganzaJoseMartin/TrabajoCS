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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute> <Outlet /> </ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route path="/pizzas" element={<PizzasPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/ingredientes" element={<IngredientsPage />} />
            <Route path="/gestion" element={<UsersPage />} />
            <Route path="/pizzas/:id/ingredientes" element={<ManagePizzaIngredients />} />
            <Route path="*" element={<Navigate to="/pizzas" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
