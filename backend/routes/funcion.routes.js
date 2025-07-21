const express = require('express');
const router = express.Router();
const funcionController = require('../controllers/funcion.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, funcionController.getFunciones);
router.get('/:id', authenticateToken, funcionController.getFuncionById);
router.post('/', authenticateToken, funcionController.createFuncion);
router.put('/:id', authenticateToken, funcionController.updateFuncion);
router.delete('/:id', authenticateToken, funcionController.deleteFuncion);

module.exports = router;