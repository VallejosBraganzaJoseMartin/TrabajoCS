const Funcion = require('../models/Funcion.model');
const RoleFuncion = require('../models/RoleFuncion.model');
const sequelize = require('../config/database');

const getFunciones = async (req, res) => {
  try {
    const funciones = await Funcion.findAll();
    res.status(200).json({ message: 'Funciones obtenidas', data: funciones });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener funciones', error });
  }
};

const getFuncionById = async (req, res) => {
  const id = req.params.id;
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) {
      return res.status(404).json({ message: 'Función no encontrada' });
    }
    res.status(200).json({ message: 'Función obtenida', data: funcion });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la función', error });
  }
};

const createFuncion = async (req, res) => {
  const { funcion_name, funcion_descripcion } = req.body;
  try {
    const funcion = await Funcion.create({ 
      funcion_name, 
      funcion_descripcion 
    });
    res.status(201).json({ message: 'Función creada', data: funcion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la función', error });
  }
};

const updateFuncion = async (req, res) => {
  const id = req.params.id;
  const { funcion_name, funcion_descripcion } = req.body;
  try {
    const [updated] = await Funcion.update(
      { funcion_name, funcion_descripcion }, 
      { where: { funcion_id: id } }
    );
    if (updated) {
      const updatedFuncion = await Funcion.findByPk(id);
      res.status(200).json({ message: 'Función actualizada', data: updatedFuncion });
    } else {
      res.status(404).json({ message: 'Función no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la función', error });
  }
};

const UserRole = require('../models/UserRole.model');
const deleteFuncion = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Función no encontrada' });
    }
    // Eliminar las referencias en la tabla intermedia roles_funciones
    await RoleFuncion.destroy({
      where: { funcion_id: id },
      transaction
    });
    // Eliminar las referencias en la tabla intermedia users_roles (si existiera relación directa)
    // await UserRole.destroy({
    //   where: { funcion_id: id },
    //   transaction
    // });
    // Luego eliminar la función
    await funcion.destroy({ transaction });
    
    await transaction.commit();
    res.status(200).json({ message: 'Función eliminada', data: funcion });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la función:', error);
    res.status(500).json({ message: 'Error al eliminar la función', error: error.message });
  }
};

module.exports = {
  getFunciones,
  getFuncionById,
  createFuncion,
  updateFuncion,
  deleteFuncion
};