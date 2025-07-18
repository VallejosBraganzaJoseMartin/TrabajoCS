const Pizza = require('../models/Pizza.model');

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
  try {
    // Buscar por piz_id explícitamente
    const pizza = await Pizza.findOne({ where: { piz_id: id } });
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza no encontrada' });
    }
    
    // Primero eliminar todas las relaciones en pizzas_ingredients
    const PizzaIngredient = require('../models/PizzaIngredient.model');
    await PizzaIngredient.destroy({
      where: { piz_id: id }
    });
    
    // Luego eliminar la pizza
    await pizza.destroy();
    res.status(200).json({
      message: 'Pizza eliminada junto con sus ingredientes asociados',
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al eliminar la pizza',
      error
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
