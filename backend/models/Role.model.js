const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  role_descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  role_state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

const Funcion = require('./Funcion.model');
const RolFuncion = require('./RolFuncion.model');
Role.belongsToMany(Funcion, {
  through: RolFuncion,
  foreignKey: 'role_id',
  otherKey: 'funcion_id',
  as: 'funciones'
});
Funcion.belongsToMany(Role, {
  through: RolFuncion,
  foreignKey: 'funcion_id',
  otherKey: 'role_id',
  as: 'roles'
});

module.exports = Role;
