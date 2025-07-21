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
    // Verificar si ya existe una función con el mismo nombre
    const existingFunction = await Funcion.findOne({ 
      where: { 
        funcion_name: funcion_name 
      } 
    });
    
    if (existingFunction) {
      return res.status(400).json({ 
        message: 'Ya existe una función con este nombre', 
        details: `No se puede agregar la función "${funcion_name}" porque ya existe otra función con el mismo nombre. Por favor, utilice un nombre único para cada función del sistema.`
      });
    }
    
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
    // Verificar si ya existe otra función con el mismo nombre
    const existingFunction = await Funcion.findOne({ 
      where: { 
        funcion_name: funcion_name,
        funcion_id: { [sequelize.Sequelize.Op.ne]: id } // Excluir la función actual
      } 
    });
    
    if (existingFunction) {
      return res.status(400).json({ 
        message: 'Ya existe otra función con este nombre', 
        details: `No se puede actualizar la función a "${funcion_name}" porque ya existe otra función con el mismo nombre. Cada función debe tener un nombre único en el sistema.`
      });
    }
    
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

const deleteFuncion = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    const funcion = await Funcion.findByPk(id);
    if (!funcion) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Función no encontrada' });
    }
    
    // Primero eliminar las referencias en la tabla intermedia
    await RoleFuncion.destroy({
      where: { funcion_id: id },
      transaction
    });
    
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