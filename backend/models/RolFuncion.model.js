const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role.model');
const Funcion = require('./Funcion.model');

const RolFuncion = sequelize.define('RolFuncion', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Role,
      key: 'role_id',
    },
  },
  funcion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Funcion,
      key: 'funcion_id',
    },
  },
}, {
  tableName: 'roles_funciones',
  timestamps: false,
});

module.exports = RolFuncion;
