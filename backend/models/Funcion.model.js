const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Funcion = sequelize.define('Funcion', {
  funcion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  funcion_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  funcion_descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  funcion_state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'funciones',
  timestamps: false
});

module.exports = Funcion;
