const express = require('express');
const router = express.Router();
const pizzaIngredientController = require('../controllers/pizzaIngredient.controller');
const { authenticateToken } = require('../controllers/auth.controller');

// Agregar ingrediente a pizza
router.post('/', authenticateToken, pizzaIngredientController.addIngredientToPizza);

// Obtener ingredientes de una pizza
router.get('/:piz_id', authenticateToken, pizzaIngredientController.getIngredientsByPizza);

// Eliminar ingrediente de una pizza
router.delete('/:piz_id/:ing_id', authenticateToken, pizzaIngredientController.removeIngredientFromPizza);

// Actualizar cantidad de ingrediente en una pizza
router.put('/:piz_id/:ing_id', authenticateToken, pizzaIngredientController.updateIngredientQuantity);

module.exports = router;
