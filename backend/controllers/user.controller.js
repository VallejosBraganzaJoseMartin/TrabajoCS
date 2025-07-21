const User = require('../models/User.model');
const Role = require('../models/Role.model');
const UserRole = require('../models/UserRole.model');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
  try {
    console.log('Obteniendo usuarios...');
    const users = await User.findAll({
      include: [{ 
        model: Role, 
        as: 'roles', 
        attributes: ['role_id', 'role_name', 'role_descripcion'],
        through: { attributes: [] } // No incluir atributos de la tabla intermedia
      }],
      order: [['user_id', 'ASC']]
    });
    console.log('Usuarios obtenidos:', users.length);
    res.status(200).json({ message: 'Usuarios obtenidos', data: users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Role, as: 'role', attributes: ['role_id', 'role_name'] }]
    });
    res.status(200).json({ message: 'Usuario obtenido', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

/* const createUser = async (req, res) => {
  const { user_names, user_surenames, user_email, user_password, role_id, user_state } = req.body;
  try {
    const user = await User.create({ user_names, user_surenames, user_email, user_password, role_id, user_state });
    res.status(200).json({ message: 'Usuario creado', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error });
  }
}; */

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { user_names, user_surenames, user_email, user_password, user_state } = req.body;
  const transaction = await sequelize.transaction();
  
  try {
    // Buscar el usuario primero con sus roles
    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role_id', 'role_name'],
        through: { attributes: [] }
      }]
    });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el usuario es administrador y se está intentando desactivar
    const isAdmin = user.roles && user.roles.some(role => role.role_name === 'Administrador');
    
    if (isAdmin && user_state === false) {
      // Contar cuántos administradores activos hay
      const adminRoleId = user.roles.find(role => role.role_name === 'Administrador').role_id;
      
      // Buscar usuarios con rol de administrador que estén activos
      const activeAdmins = await User.findAll({
        include: [{
          model: Role,
          as: 'roles',
          where: { role_id: adminRoleId },
          through: { attributes: [] }
        }],
        where: { 
          user_state: true,
          user_id: { [Op.ne]: id } // Excluir al usuario actual
        }
      });
      
      // Si no hay otros administradores activos, no permitir la desactivación
      if (activeAdmins.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'No se puede desactivar al último administrador activo', 
          details: 'Debe haber al menos un administrador activo en el sistema' 
        });
      }
    }
    
    // Preparar los datos para actualizar
    const updateData = { 
      user_names, 
      user_surenames, 
      user_email, 
      user_state 
    };
    
    // Solo actualizar la contraseña si se proporciona una nueva
    if (user_password) {
      updateData.user_password = await bcrypt.hash(user_password, 10);
    }
    
    // Actualizar el usuario
    await user.update(updateData, { transaction });
    
    await transaction.commit();
    
    // Obtener el usuario actualizado con sus roles
    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role_id', 'role_name', 'role_descripcion'],
        through: { attributes: [] }
      }]
    });
    
    res.status(200).json({ message: 'Usuario actualizado', data: updatedUser });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    // Buscar el usuario con sus roles
    const user = await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role_id', 'role_name'],
        through: { attributes: [] }
      }]
    });
    
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el usuario es administrador
    const isAdmin = user.roles && user.roles.some(role => role.role_name === 'Administrador');
    
    if (isAdmin) {
      // Contar cuántos administradores activos hay
      const adminRoleId = user.roles.find(role => role.role_name === 'Administrador').role_id;
      
      // Buscar usuarios con rol de administrador que estén activos
      const activeAdmins = await User.findAll({
        include: [{
          model: Role,
          as: 'roles',
          where: { role_id: adminRoleId },
          through: { attributes: [] }
        }],
        where: { 
          user_state: true,
          user_id: { [Op.ne]: id } // Excluir al usuario actual
        }
      });
      
      // Si no hay otros administradores activos, no permitir la eliminación
      if (activeAdmins.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'No se puede eliminar al último administrador activo', 
          details: 'Debe haber al menos un administrador activo en el sistema' 
        });
      }
    }
    
    // Eliminar primero las referencias en la tabla intermedia
    await UserRole.destroy({
      where: { user_id: id },
      transaction
    });
    
    // Luego eliminar el usuario
    await user.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({ message: 'Usuario eliminado', data: user });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Asignar roles a un usuario
const assignRolesToUser = async (req, res) => {
  const userId = req.params.id;
  const { roleIds } = req.body;
  
  if (!Array.isArray(roleIds)) {
    return res.status(400).json({ message: 'roleIds debe ser un array' });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar que el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Eliminar todos los roles actuales del usuario
    await user.setRoles([], { transaction });
    
    // Asignar los nuevos roles
    if (roleIds.length > 0) {
      const roles = await Role.findAll({
        where: {
          role_id: roleIds
        }
      });
      
      await user.addRoles(roles, { transaction });
    }
    
    await transaction.commit();
    
    // Obtener el usuario con sus roles actualizados
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Role,
        as: 'roles',
        attributes: ['role_id', 'role_name', 'role_descripcion'],
        through: { attributes: [] }
      }]
    });
    
    res.status(200).json({
      message: 'Roles asignados correctamente',
      data: updatedUser
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al asignar roles:', error);
    res.status(500).json({ message: 'Error al asignar roles al usuario', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  /* createUser, */
  updateUser,
  deleteUser,
  assignRolesToUser
};
