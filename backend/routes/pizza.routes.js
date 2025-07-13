const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizza.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, pizzaController.getPizzas);
router.get('/:id', authenticateToken, pizzaController.getPizzaById);
router.post('/', authenticateToken, pizzaController.createPizza);
router.put('/:id', authenticateToken, pizzaController.updatePizza);
router.delete('/:id', authenticateToken, pizzaController.deletePizza);

module.exports = router;
