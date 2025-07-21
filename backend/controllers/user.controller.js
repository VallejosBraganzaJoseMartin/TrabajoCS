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

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { user_names, user_surenames, user_email, user_password, user_state } = req.body;
  const transaction = await sequelize.transaction();
  
  try {
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
    
    const isAdmin = user.roles && user.roles.some(role => role.role_name === 'Administrador');
    
    if (isAdmin && user_state === false) {
      const adminRoleId = user.roles.find(role => role.role_name === 'Administrador').role_id;
      const activeAdmins = await User.findAll({
        include: [{
          model: Role,
          as: 'roles',
          where: { role_id: adminRoleId },
          through: { attributes: [] }
        }],
        where: { 
          user_state: true,
          user_id: { [Op.ne]: id } 
        }
      });
      
      if (activeAdmins.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'No se puede desactivar al último administrador activo', 
          details: 'Debe haber al menos un administrador activo en el sistema' 
        });
      }
    }
    
    const updateData = { 
      user_names, 
      user_surenames, 
      user_email, 
      user_state 
    };
    
    if (user_password) {
      updateData.user_password = await bcrypt.hash(user_password, 10);
    }
    
    await user.update(updateData, { transaction });
    
    await transaction.commit();
    
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
    
    const isAdmin = user.roles && user.roles.some(role => role.role_name === 'Administrador');
    
    if (isAdmin) {
      const adminRoleId = user.roles.find(role => role.role_name === 'Administrador').role_id;
      
      const activeAdmins = await User.findAll({
        include: [{
          model: Role,
          as: 'roles',
          where: { role_id: adminRoleId },
          through: { attributes: [] }
        }],
        where: { 
          user_state: true,
          user_id: { [Op.ne]: id } 
        }
      });
      
      if (activeAdmins.length === 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: 'No se puede eliminar al último administrador activo.',
          details: 'Esta acción está bloqueada porque el usuario seleccionado es el único administrador que queda en el sistema. Si se elimina, nadie podrá gestionar ni administrar el sistema. Por favor, asigne otro usuario como administrador antes de eliminar este.'
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

const assignRolesToUser = async (req, res) => {
  const userId = req.params.id;
  const { roleIds } = req.body;
  
  if (!Array.isArray(roleIds)) {
    return res.status(400).json({ message: 'roleIds debe ser un array' });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    await user.setRoles([], { transaction });
 
    if (roleIds.length > 0) {
      const roles = await Role.findAll({
        where: {
          role_id: roleIds
        }
      });
      
      await user.addRoles(roles, { transaction });
    }
    
    await transaction.commit();
    
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
  updateUser,
  deleteUser,
  assignRolesToUser
};
