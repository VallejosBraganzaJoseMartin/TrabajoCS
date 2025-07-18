const Funcion = require('../models/Funcion.model');
const Role = require('../models/Role.model');

const getFunciones = async (req, res) => {
  try {
    const funciones = await Funcion.findAll({
      order: [['funcion_state', 'DESC'], ['funcion_id', 'ASC']]
    });
    res.status(200).json({ message: 'Funciones obtenidas', data: funciones });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener funciones', error });
  }
};

const getFuncionById = async (req, res) => {
  const id = req.params.id;
  try {
    const funcion = await Funcion.findByPk(id);
    res.status(200).json({ message: 'Función obtenida', data: funcion });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la función', error });
  }
};

const createFuncion = async (req, res) => {
  const { funcion_name, funcion_descripcion, funcion_state } = req.body;
  try {
    const funcion = await Funcion.create({ funcion_name, funcion_descripcion, funcion_state });
    res.status(201).json({ message: 'Función creada', data: funcion });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la función', error });
  }
};

const updateFuncion = async (req, res) => {
  const id = req.params.id;
  const { funcion_name, funcion_descripcion, funcion_state } = req.body;
  try {
    const [updated] = await Funcion.update(
      { funcion_name, funcion_descripcion, funcion_state },
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

const deleteFuncion = async (req, res) => {
  const id = req.params.id;
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) {
      return res.status(404).json({ message: 'Función no encontrada' });
    }
    
    // Primero eliminar todas las relaciones en roles_funciones
    const RolFuncion = require('../models/RolFuncion.model');
    await RolFuncion.destroy({
      where: { funcion_id: id }
    });
    
    // Luego eliminar la función
    await funcion.destroy();
    res.status(200).json({ 
      message: 'Función eliminada junto con sus relaciones con roles', 
      data: funcion 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la función', error });
  }
};

module.exports = {
  getFunciones,
  getFuncionById,
  createFuncion,
  updateFuncion,
  deleteFuncion
};
