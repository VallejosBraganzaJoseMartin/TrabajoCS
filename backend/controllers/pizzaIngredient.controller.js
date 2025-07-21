const PizzaIngredient = require('../models/PizzaIngredient.model');
const Ingredient = require('../models/Ingredient.model');
const Pizza = require('../models/Pizza.model');
const sequelize = require('../config/database');

const addIngredientToPizza = async (req, res) => {
  const { piz_id, ing_id, piz_ing_quantity } = req.body;
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar que la pizza existe y está activa
    const pizza = await Pizza.findByPk(piz_id);
    if (!pizza) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: 'Pizza no encontrada',
        details: 'La pizza especificada no existe en el sistema'
      });
    }
    
    if (!pizza.piz_state) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Pizza inactiva',
        details: 'No se pueden agregar ingredientes a una pizza inactiva'
      });
    }
    
    // Verificar que el ingrediente existe y está activo
    const ingredient = await Ingredient.findByPk(ing_id);
    if (!ingredient) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: 'Ingrediente no encontrado',
        details: 'El ingrediente especificado no existe en el sistema'
      });
    }
    
    if (!ingredient.ing_state) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Ingrediente inactivo',
        details: 'No se puede agregar un ingrediente inactivo a una pizza'
      });
    }
    
    // Verificar si ya existe la relación
    const existingRelation = await PizzaIngredient.findOne({
      where: { piz_id, ing_id },
      transaction
    });
    
    if (existingRelation) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Relación duplicada',
        details: 'Este ingrediente ya está asociado a esta pizza'
      });
    }
    
    // Crear la nueva relación
    const newRelation = await PizzaIngredient.create(
      { piz_id, ing_id, piz_ing_quantity },
      { transaction }
    );
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Ingrediente agregado a pizza',
      data: newRelation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al agregar ingrediente a pizza:', error);
    res.status(500).json({
      message: 'Error al agregar ingrediente',
      error: error.message
    });
  }
};

const getIngredientsByPizza = async (req, res) => {
  const { piz_id } = req.params;
  try {
    const ingredients = await PizzaIngredient.findAll({
      where: { piz_id },
      include: [{
        model: Ingredient,
        attributes: ['ing_id', 'ing_name', 'ing_calories', 'ing_state']
      }]
    });

    const data = ingredients.map(pi => {
      if (!pi.Ingredient) {
        return null;
      }
      return {
        ...pi.Ingredient.dataValues,
        piz_ing_quantity: pi.piz_ing_quantity
      };
    }).filter(Boolean);
    res.status(200).json({
      message: 'Ingredientes obtenidos',
      data
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener ingredientes',
      error: error.message
    });
  }
};

const removeIngredientFromPizza = async (req, res) => {
  const { piz_id, ing_id } = req.params;
  try {
    const relation = await PizzaIngredient.findOne({ where: { piz_id, ing_id } });
    if (!relation) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }
    await relation.destroy();
    res.status(200).json({
      message: 'Ingrediente eliminado de la pizza',
      data: relation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar ingrediente',
      error: error.message
    });
  }
};

const updateIngredientQuantity = async (req, res) => {
  const { piz_id, ing_id } = req.params;
  const { piz_ing_quantity } = req.body;
  const transaction = await sequelize.transaction();
  
  try {
    // Verificar que la pizza existe y está activa
    const pizza = await Pizza.findByPk(piz_id);
    if (!pizza) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: 'Pizza no encontrada',
        details: 'La pizza especificada no existe en el sistema'
      });
    }
    
    if (!pizza.piz_state) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Pizza inactiva',
        details: 'No se pueden modificar ingredientes de una pizza inactiva'
      });
    }
    
    // Verificar que el ingrediente existe y está activo
    const ingredient = await Ingredient.findByPk(ing_id);
    if (!ingredient) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: 'Ingrediente no encontrado',
        details: 'El ingrediente especificado no existe en el sistema'
      });
    }
    
    if (!ingredient.ing_state) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Ingrediente inactivo',
        details: 'No se puede modificar un ingrediente inactivo en una pizza'
      });
    }
    
    // Verificar que la relación existe
    const relation = await PizzaIngredient.findOne({ 
      where: { piz_id, ing_id },
      transaction
    });
    
    if (!relation) {
      await transaction.rollback();
      return res.status(404).json({ 
        message: 'Relación no encontrada',
        details: 'Este ingrediente no está asociado a esta pizza'
      });
    }
    
    // Actualizar la cantidad
    await relation.update({ piz_ing_quantity }, { transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      message: 'Cantidad actualizada',
      data: relation
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar cantidad de ingrediente:', error);
    res.status(500).json({
      message: 'Error al actualizar cantidad',
      error: error.message
    });
  }
};

module.exports = {
  addIngredientToPizza,
  getIngredientsByPizza,
  removeIngredientFromPizza,
  updateIngredientQuantity
};
