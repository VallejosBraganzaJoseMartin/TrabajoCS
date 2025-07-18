const UsuarioRol = require('../models/UsuarioRol.model');
const User = require('../models/User.model');
const Role = require('../models/Role.model');

// Asignar roles a un usuario
const assignRolesToUser = async (req, res) => {
  const { user_id } = req.params;
  const { role_ids } = req.body; // Array de IDs de roles
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear las relaciones directamente en la tabla de unión para mantener los roles existentes
    for (const role_id of role_ids) {
      await UsuarioRol.findOrCreate({
        where: { user_id: user_id, role_id: role_id }
      });
    }

    res.status(200).json({ message: 'Roles asignados al usuario' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar roles', error });
  }
};

// Obtener roles de un usuario
const getRolesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findByPk(user_id, {
      include: [{ model: Role, as: 'roles', through: { attributes: [] } }]
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json({ message: 'Roles del usuario obtenidos', data: user.roles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles del usuario', error });
  }
};

// Remover un rol de un usuario
const removeRoleFromUser = async (req, res) => {
  const { user_id, role_id } = req.params;
  try {
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    
    // Eliminar la relación directamente de la tabla intermedia
    const deletedRows = await UsuarioRol.destroy({
      where: { user_id: user_id, role_id: role_id }
    });
    
    if (deletedRows === 0) {
      return res.status(404).json({ message: 'La relación usuario-rol no existe' });
    }
    
    res.status(200).json({ message: 'Rol removido del usuario' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover rol del usuario', error });
  }
};

module.exports = {
  assignRolesToUser,
  getRolesByUser,
  removeRoleFromUser
};
