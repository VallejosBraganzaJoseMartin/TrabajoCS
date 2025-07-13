const Role = require('../models/Role.model');

const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ message: 'Roles obtenidos', data: roles });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
};

const getRoleById = async (req, res) => {
  const id = req.params.id;
  try {
    const role = await Role.findByPk(id);
    res.status(200).json({ message: 'Rol obtenido', data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el rol', error });
  }
};

const createRole = async (req, res) => {
  const { role_name } = req.body;
  try {
    const role = await Role.create({ role_name });
    res.status(200).json({ message: 'Rol creado', data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el rol', error });
  }
};

const updateRole = async (req, res) => {
  const id = req.params.id;
  const { role_name } = req.body;
  try {
    const [updated] = await Role.update({ role_name }, { where: { role_id: id } });
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
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    await role.destroy();
    res.status(200).json({ message: 'Rol eliminado', data: role });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el rol', error });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
