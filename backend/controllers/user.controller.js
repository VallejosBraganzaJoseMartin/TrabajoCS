const User = require('../models/User.model');
const Role = require('../models/Role.model');
const UsuarioRol = require('../models/UsuarioRol.model');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'roles', through: { attributes: [] }, attributes: ['role_id', 'role_name'] }],
      order: [['user_id', 'ASC']]
    });
    res.status(200).json({ message: 'Usuarios obtenidos', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      include: [{ model: Role, as: 'roles', through: { attributes: [] }, attributes: ['role_id', 'role_name'] }]
    });
    res.status(200).json({ message: 'Usuario obtenido', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { user_names, user_surenames, user_email, user_password, user_state } = req.body;
  try {
    const hashedPassword = user_password ? await bcrypt.hash(user_password, 10) : undefined;
    const updateData = {
      user_names,
      user_surenames,
      user_email,
      user_state
    };
    if (hashedPassword) updateData.user_password = hashedPassword;
    const [updated] = await User.update(updateData, { where: { user_id: id } });
    if (updated) {
      const updatedUser = await User.findByPk(id, {
        include: [{ model: Role, as: 'roles', through: { attributes: [] }, attributes: ['role_id', 'role_name'] }]
      });
      res.status(200).json({ message: 'Usuario actualizado', data: updatedUser });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario', error });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
