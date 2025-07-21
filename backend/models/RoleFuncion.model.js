const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoleFuncion = sequelize.define('RoleFuncion', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'role_id'
    }
  },
  funcion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: 'funciones',
      key: 'funcion_id'
    }
  }
}, {
  tableName: 'roles_funciones',
  timestamps: false
});

module.exports = RoleFuncion;