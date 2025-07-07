const express = require('express');
const router = express.Router();
const pizzaIngredientController = require('../controllers/pizzaIngredient.controller');

// Agregar ingrediente a pizza
router.post('/', pizzaIngredientController.addIngredientToPizza);

// Obtener ingredientes de una pizza
router.get('/:piz_id', pizzaIngredientController.getIngredientsByPizza);

// Eliminar ingrediente de una pizza
router.delete('/:piz_id/:ing_id', pizzaIngredientController.removeIngredientFromPizza);

// Actualizar cantidad de ingrediente en una pizza
router.put('/:piz_id/:ing_id', pizzaIngredientController.updateIngredientQuantity);

module.exports = router;
