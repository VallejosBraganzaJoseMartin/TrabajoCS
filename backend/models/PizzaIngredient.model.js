const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Pizza = require('./Pizza.model');
const Ingredient = require('./Ingredient.model');

const PizzaIngredient = sequelize.define('PizzaIngredient', {
  piz_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Pizza,
      key: 'piz_id',
    },
  },
  ing_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Ingredient,
      key: 'ing_id',
    },
  },
  piz_ing_quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
}, {
  tableName: 'pizzas_ingredients',
  timestamps: false,
});


Pizza.belongsToMany(Ingredient, {
  through: PizzaIngredient,
  foreignKey: 'piz_id',
  otherKey: 'ing_id',
});
Ingredient.belongsToMany(Pizza, {
  through: PizzaIngredient,
  foreignKey: 'ing_id',
  otherKey: 'piz_id',
});

module.exports = PizzaIngredient;
