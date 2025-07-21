const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken } = require('../controllers/auth.controller');

router.get('/', authenticateToken, userController.getUsers);
router.get('/:id', authenticateToken, userController.getUserById);
/* router.post('/', userController.createUser); */
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

// Ruta para asignar roles a un usuario
router.post('/:id/roles', authenticateToken, userController.assignRolesToUser);

module.exports = router;
