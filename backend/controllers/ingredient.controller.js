const Ingredient = require('../models/Ingredient.model');

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

const PizzaIngredient = require('../models/PizzaIngredient.model');
const deleteIngredient = async (req, res) => {
  const id = req.params.id;
  try {
    const ingredient = await Ingredient.findByPk(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingrediente no encontrado' });
    }
    // Eliminar registros de la tabla intermedia
    await PizzaIngredient.destroy({ where: { ing_id: id } });
    await ingredient.destroy();
    res.status(200).json({
      message: 'Ingrediente eliminado',
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar el ingrediente',
      error
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
