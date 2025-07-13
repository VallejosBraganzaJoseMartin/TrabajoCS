const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredient.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, ingredientController.getIngredients);
router.get('/:id', authenticateToken, ingredientController.getIngredientById);
router.post('/', authenticateToken, ingredientController.createIngredient);
router.put('/:id', authenticateToken, ingredientController.updateIngredient);
router.delete('/:id', authenticateToken, ingredientController.deleteIngredient);

module.exports = router;
