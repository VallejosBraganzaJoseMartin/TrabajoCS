const Ingredient = require('../models/Ingredient.model');
const PizzaIngredient = require('../models/PizzaIngredient.model');
const sequelize = require('../config/database');

const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.findAll({
      order: [
        ['ing_state', 'DESC'],
        ['ing_id', 'ASC']
      ] 
    });
    res.status(200).json({
      message: 'Ingredientes obtenidos',
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener ingredientes',
      error
    });
  }
};

const getIngredientById = async (req, res) => {
  const id = req.params.id;
  try {
    const ingredient = await Ingredient.findByPk(id);
    res.status(200).json({
      message: 'Ingrediente obtenido',
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener el ingrediente',
      error
    });
  }
};

const createIngredient = async (req, res) => {
  const { ing_name, ing_calories, ing_state } = req.body;
  try {
    // Verificar si ya existe un ingrediente con el mismo nombre
    const existingIngredient = await Ingredient.findOne({ 
      where: { ing_name: ing_name } 
    });
    
    if (existingIngredient) {
      return res.status(400).json({ 
        message: `¡ATENCIÓN! El ingrediente "${ing_name}" YA EXISTE`, 
        details: `No se puede agregar este ingrediente porque ya existe en el sistema. Por favor, utilice un nombre diferente.`
      });
    }
    
    const ingredient = await Ingredient.create({ ing_name, ing_calories, ing_state });
    res.status(200).json({
      message: 'Ingrediente creado',
      body: { ingredient }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear el ingrediente',
      error
    });
  }
};

const updateIngredient = async (req, res) => {
  const id = req.params.id;
  const { ing_name, ing_calories, ing_state } = req.body;
  try {
    const existingIngredient = await Ingredient.findOne({ 
      where: { 
        ing_name: ing_name,
        ing_id: { [sequelize.Sequelize.Op.ne]: id } 
      } 
    });
    
    if (existingIngredient) {
      return res.status(400).json({ 
        message: `El ingrediente "${ing_name}" ya existe`, 
        details: `No se puede ingresar este nombre porque ya existe otro ingrediente con el mismo nombre en el sistema.`
      });
    }
    
    const [updated] = await Ingredient.update(
      { ing_name, ing_calories, ing_state },
      { where: { ing_id: id }, returning: true }
    );
    if (updated) {
      const updatedIngredient = await Ingredient.findByPk(id);
      res.status(200).json({
        message: 'Ingrediente actualizado',
        data: updatedIngredient
      });
    } else {
      res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el ingrediente',
      error
    });
  }
};

const deleteIngredient = async (req, res) => {
  const id = req.params.id;
  const transaction = await sequelize.transaction();
  
  try {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    
    await PizzaIngredient.destroy({
      where: { ing_id: id },
      transaction
    });

    await ingredient.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      message: 'Ingrediente eliminado',
      data: ingredient
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar el ingrediente:', error);
    res.status(500).json({
      message: 'Error al eliminar el ingrediente',
      error: error.message
    });
  }
};

module.exports = {
  getIngredients,
  getIngredientById,
  createIngredient,
  deleteIngredient,
  updateIngredient
};
