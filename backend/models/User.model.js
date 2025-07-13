const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./Role.model');

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

User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });

module.exports = User;
