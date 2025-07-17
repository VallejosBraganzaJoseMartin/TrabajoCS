const express = require('express');
const router = express.Router();
const rolesFuncionesController = require('../controllers/rolesFunciones.controller');
const { authenticateToken } = require('../controllers/auth.controller');

// Asignar funciones a un rol
router.post('/:role_id/funciones', authenticateToken, rolesFuncionesController.assignFuncionesToRole);
// Obtener funciones de un rol
router.get('/:role_id/funciones', authenticateToken, rolesFuncionesController.getFuncionesByRole);
// Remover una función de un rol
router.delete('/:role_id/funciones/:funcion_id', authenticateToken, rolesFuncionesController.removeFuncionFromRole);

module.exports = router;
