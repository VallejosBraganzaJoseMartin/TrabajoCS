const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_names: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_surenames: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  user_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

const Role = require('./Role.model');
const UsuarioRol = require('./UsuarioRol.model');
User.belongsToMany(Role, {
  through: UsuarioRol,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles'
});
Role.belongsToMany(User, {
  through: UsuarioRol,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users'
});


module.exports = User;
