const Pizza = require('../models/Pizza.model');
const PizzaIngredient = require('../models/PizzaIngredient.model');
const sequelize = require('../config/database');
//pizza xd
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll({
      order: [
        ['piz_state', 'DESC'],
        ['piz_id', 'ASC']
      ]
    });
    res.status(200).json({
      message: 'Pizzas obtenidas',
      data: pizzas
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pizzas',
      error
    });
  }
};

const getPizzaById = async (req, res) => {
  const id = req.params.id;
  try {
    const pizza = await Pizza.findByPk(id);
    res.status(200).json({
      message: 'Pizza obtenida',
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener la pizza',
      error
    });
  }
};

const createPizza = async (req, res) => {
  const { piz_name, piz_origin, piz_state, url_image } = req.body;
  try {
    const existingPizza = await Pizza.findOne({ 
      where: { piz_name: piz_name } 
    });
    
    if (existingPizza) {
      return res.status(400).json({ 
        message: `La pizza "${piz_name}" ya existe`, 
        details: `No se puede agregar esta pizza porque ya existe en el sistema. Por favor, utilice un nombre diferente.`
      });
    }
    
    const pizza = await Pizza.create({ piz_name, piz_origin, piz_state, url_image });
    res.status(200).json({
      message: 'Pizza creada',
      body: { pizza }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la pizza',
      error
    });
  }
};

const updatePizza = async (req, res) => {
  const id = req.params.id;
  const { piz_name, piz_origin, piz_state, url_image } = req.body;
  try {
    // Verificar si ya existe otra pizza con el mismo nombre
    const existingPizza = await Pizza.findOne({ 
      where: { 
        piz_name: piz_name,
        piz_id: { [sequelize.Sequelize.Op.ne]: id }
      } 
    });
    
    if (existingPizza) {
      return res.status(400).json({ 
        message: `La pizza "${piz_name}" ya existe`, 
        details: `No se puede ingresar este nombre porque ya existe otra pizza con el mismo nombre en el sistema.`
      });
    }
    
    const [updated] = await Pizza.update(
      { piz_name, piz_origin, piz_state, url_image },
      { where: { piz_id: id }, returning: true }
    );
    if (updated) {
      const updatedPizza = await Pizza.findByPk(id);
      res.status(200).json({
        message: 'Pizza actualizada',
        data: updatedPizza
      });
    } else {
      res.status(404).json({ message: 'Pizza no encontrada' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la pizza',
      error
    });
  }
};

const deletePizza = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    const pizza = await Pizza.findOne({ where: { piz_id: id } });
    if (!pizza) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Pizza no encontrada' });
    }
  
    await PizzaIngredient.destroy({
      where: { piz_id: id },
      transaction
    });
    
    await pizza.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      message: 'Pizza eliminada',
      data: pizza
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar la pizza:', error);
    res.status(500).json({
      message: 'Error al eliminar la pizza',
      error: error.message
    });
  }
};

module.exports = {
  getPizzas,
  getPizzaById,
  createPizza,
  deletePizza,
  updatePizza
};
