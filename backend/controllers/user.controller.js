const User = require('../models/User.model');
const Role = require('../models/Role.model');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as: 'role', attributes: ['role_id', 'role_name'] }],
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
  const { user_names, user_surenames, user_email, user_password, role_id, user_state } = req.body;
  try {
    const [updated] = await User.update(
      { user_names, user_surenames, user_email, user_password, role_id, user_state },
      { where: { user_id: id } }
    );
    if (updated) {
      const updatedUser = await User.findByPk(id, {
        include: [{ model: Role, as: 'role', attributes: ['role_id', 'role_name'] }]
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
  /* createUser, */
  updateUser,
  deleteUser
};
