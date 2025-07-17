const RolFuncion = require('../models/RolFuncion.model');
const Role = require('../models/Role.model');
const Funcion = require('../models/Funcion.model');

// Asignar funciones a un rol
const assignFuncionesToRole = async (req, res) => {
  const { role_id } = req.params;
  const { funcion_ids } = req.body; // Array de IDs de funciones
  try {
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    await role.setFunciones(funcion_ids);
    res.status(200).json({ message: 'Funciones asignadas al rol' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar funciones', error });
  }
};

// Obtener funciones de un rol
const getFuncionesByRole = async (req, res) => {
  const { role_id } = req.params;
  try {
    const role = await Role.findByPk(role_id, {
      include: [{ model: Funcion, as: 'funciones', through: { attributes: [] } }]
    });
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.status(200).json({ message: 'Funciones del rol obtenidas', data: role.funciones });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener funciones del rol', error });
  }
};

// Remover una función de un rol
const removeFuncionFromRole = async (req, res) => {
  const { role_id, funcion_id } = req.params;
  try {
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    await role.removeFuncion(funcion_id);
    res.status(200).json({ message: 'Función removida del rol' });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover función del rol', error });
  }
};

module.exports = {
  assignFuncionesToRole,
  getFuncionesByRole,
  removeFuncionFromRole
};
