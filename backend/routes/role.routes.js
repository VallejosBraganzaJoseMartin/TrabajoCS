const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, roleController.getRoles);
router.get('/:id', authenticateToken, roleController.getRoleById);
router.post('/', authenticateToken, roleController.createRole);
router.put('/:id', authenticateToken, roleController.updateRole);
router.delete('/:id', authenticateToken, roleController.deleteRole);

// Rutas para la asignación de funciones a roles
router.post('/:id/functions', authenticateToken, roleController.assignFunctionsToRole);
router.get('/:id/functions', authenticateToken, roleController.getRoleFunctions);

module.exports = router;
