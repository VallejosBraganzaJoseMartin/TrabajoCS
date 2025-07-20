const Role = require('../models/Role.model');
const Funcion = require('../models/Funcion.model');
const RoleFuncion = require('../models/RoleFuncion.model');
const sequelize = require('../config/database');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Funcion,
        as: 'funciones',
        attributes: ['funcion_id', 'funcion_name', 'funcion_descripcion'],
        through: { attributes: [] }
      }]
    });
    res.status(200).json({ message: 'Roles obtenidos', data: roles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
};

const getRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findByPk(id, {
      include: [{
        model: Funcion,
        as: 'funciones',
        attributes: ['funcion_id', 'funcion_name', 'funcion_descripcion'],
        through: { attributes: [] }
      }]
    });
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.status(200).json({ message: 'Rol obtenido', data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el rol', error });
  }
};

const createRole = async (req, res) => {
  const { role_name, role_descripcion } = req.body;
  try {
    const role = await Role.create({ role_name, role_descripcion });
    res.status(200).json({ message: 'Rol creado', data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol', error });
  }
};

const updateRole = async (req, res) => {
  const id = req.params.id;
  const { role_name, role_descripcion } = req.body;
  try {
    const [updated] = await Role.update({ role_name, role_descripcion }, { where: { role_id: id } });
    if (updated) {
      const updatedRole = await Role.findByPk(id);
      res.status(200).json({ message: 'Rol actualizado', data: updatedRole });
    } else {
      res.status(404).json({ message: 'Rol no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el rol', error });
  }
};

const deleteRole = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    
    // Eliminar las referencias en la tabla intermedia roles_funciones
    await RoleFuncion.destroy({
      where: { role_id: id },
      transaction
    });
    
    // Eliminar el rol
    await role.destroy({ transaction });
    
    await transaction.commit();
    res.status(200).json({ message: 'Rol eliminado', data: role });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Error al eliminar el rol', error: error.message });
  }
};

// Asignar funciones a un rol
const assignFunctionsToRole = async (req, res) => {
  const roleId = req.params.id;
  const { functionIds } = req.body;
  
  if (!Array.isArray(functionIds)) {
    return res.status(400).json({ message: 'functionIds debe ser un array' });
  }
  
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar que el rol existe
    const role = await Role.findByPk(roleId);
    if (!role) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    
    // Eliminar todas las funciones actuales del rol
    await role.setFunciones([], { transaction });
    
    // Asignar las nuevas funciones
    if (functionIds.length > 0) {
      const funciones = await Funcion.findAll({
        where: {
          funcion_id: functionIds
        }
      });
      
      await role.addFunciones(funciones, { transaction });
    }
    
    await transaction.commit();
    
    // Obtener el rol con sus funciones actualizadas
    const updatedRole = await Role.findByPk(roleId, {
      include: [{
        model: Funcion,
        as: 'funciones',
        attributes: ['funcion_id', 'funcion_name', 'funcion_descripcion'],
        through: { attributes: [] }
      }]
    });
    
    res.status(200).json({
      message: 'Funciones asignadas correctamente',
      data: updatedRole
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al asignar funciones:', error);
    res.status(500).json({ message: 'Error al asignar funciones al rol', error: error.message });
  }
};

// Obtener funciones de un rol
const getRoleFunctions = async (req, res) => {
  const roleId = req.params.id;
  try {
    const role = await Role.findByPk(roleId, {
      include: [{
        model: Funcion,
        as: 'funciones',
        attributes: ['funcion_id', 'funcion_name', 'funcion_descripcion'],
        through: { attributes: [] }
      }]
    });
    
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    
    res.status(200).json({
      message: 'Funciones del rol obtenidas',
      data: role.funciones || []
    });
  } catch (error) {
    console.error('Error al obtener funciones del rol:', error);
    res.status(500).json({ message: 'Error al obtener funciones del rol', error: error.message });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignFunctionsToRole,
  getRoleFunctions
};
