import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PizzasPage from './pages/PizzasPage'
import IngredientsPage from './pages/IngredientsPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/pizzas" replace />} />
        <Route path="/pizzas" element={<PizzasPage />} />
        <Route path="/ingredientes" element={<IngredientsPage />} />
        <Route path="*" element={<Navigate to="/pizzas" replace />} />
      </Routes>
    </Router>
  );
}

export default App
