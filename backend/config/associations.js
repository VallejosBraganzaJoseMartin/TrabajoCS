// backend/config/associations.js (o directamente en app.js)

const User = require('../models/User.model');
const Role = require('../models/Role.model');
const Funcion = require('../models/Funcion.model');
const UserRole = require('../models/UserRole.model'); 
const RoleFuncion = require('../models/RoleFuncion.model'); 
// Relación muchos a muchos entre User y Role
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'user_id',
  otherKey: 'role_id',
  as: 'roles'
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'role_id',
  otherKey: 'user_id',
  as: 'users'
});

Role.belongsToMany(Funcion, {
  through: RoleFuncion,
  foreignKey: 'role_id',
  otherKey: 'funcion_id',
  as: 'funciones'
});
Funcion.belongsToMany(Role, {
  through: RoleFuncion,
  foreignKey: 'funcion_id',
  otherKey: 'role_id',
  as: 'roles'
});

module.exports = { User, Role, Funcion, UserRole, RoleFuncion }; // Exporta los modelos con asociaciones si los usas en otros lugares