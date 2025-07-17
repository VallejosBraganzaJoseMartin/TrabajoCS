const express = require('express');
const router = express.Router();
const rolesUsuariosController = require('../controllers/rolesUsuarios.controller');
const { authenticateToken } = require('../controllers/auth.controller');

// Asignar roles a un usuario
router.post('/:user_id/roles', authenticateToken, rolesUsuariosController.assignRolesToUser);
// Obtener roles de un usuario
router.get('/:user_id/roles', authenticateToken, rolesUsuariosController.getRolesByUser);
// Remover un rol de un usuario
router.delete('/:user_id/roles/:role_id', authenticateToken, rolesUsuariosController.removeRoleFromUser);

module.exports = router;
