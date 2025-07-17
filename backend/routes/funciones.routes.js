const express = require('express');
const router = express.Router();
const funcionesController = require('../controllers/funciones.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, funcionesController.getFunciones);
router.get('/:id', authenticateToken, funcionesController.getFuncionById);
router.post('/', authenticateToken, funcionesController.createFuncion);
router.put('/:id', authenticateToken, funcionesController.updateFuncion);
router.delete('/:id', authenticateToken, funcionesController.deleteFuncion);

module.exports = router;
