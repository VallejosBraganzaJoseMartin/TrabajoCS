const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ingredient = sequelize.define('Ingredient', {
  ing_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ing_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ing_calories: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  ing_state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'Ingredients',
  timestamps: false,
});

module.exports = Ingredient;
