const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User.model');
const Role = require('./Role.model');

const UsuarioRol = sequelize.define('UsuarioRol', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  role_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Role,
      key: 'role_id',
    },
  },
}, {
  tableName: 'usuarios_roles',
  timestamps: false,
});

module.exports = UsuarioRol;
