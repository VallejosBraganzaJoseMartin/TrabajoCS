const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/pizza.controller');

router.get('/', pizzaController.getPizzas);
router.get('/:id', pizzaController.getPizzaById);
router.post('/', pizzaController.createPizza);
router.put('/:id', pizzaController.updatePizza);
router.delete('/:id', pizzaController.deletePizza);

module.exports = router;
