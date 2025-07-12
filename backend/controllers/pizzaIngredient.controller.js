const PizzaIngredient = require('../models/PizzaIngredient.model');
const Ingredient = require('../models/Ingredient.model');

const addIngredientToPizza = async (req, res) => {
  const { piz_id, ing_id, piz_ing_quantity } = req.body;
  try {
    const newRelation = await PizzaIngredient.create({ piz_id, ing_id, piz_ing_quantity });
    res.status(201).json({
      message: 'Ingrediente agregado a pizza',
      data: newRelation
    });
  } catch (error) {
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
  try {
    const [updated] = await PizzaIngredient.update(
      { piz_ing_quantity },
      { where: { piz_id, ing_id }, returning: true }
    );
    if (updated) {
      const updatedRelation = await PizzaIngredient.findOne({ where: { piz_id, ing_id } });
      res.status(200).json({
        message: 'Cantidad actualizada',
        data: updatedRelation
      });
    } else {
      res.status(404).json({ message: 'Relación no encontrada' });
    }
  } catch (error) {
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
