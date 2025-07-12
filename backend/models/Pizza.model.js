const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pizza = sequelize.define('Pizza', {
  piz_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  piz_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  piz_origin: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  piz_state: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  url_image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Pizzas',
  timestamps: false,
});

module.exports = Pizza;
