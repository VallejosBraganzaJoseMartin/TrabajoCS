const User = require('../models/User.model');
const Role = require('../models/Role.model');
const UsuarioRol = require('../models/UsuarioRol.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Blacklist de tokens en memoria
const tokenBlacklist = [];

// Registro de usuario
const register = async (req, res) => {
  const { user_names, user_surenames, user_email, user_password } = req.body;
  try {
    // Verificar si el email ya existe
    const existing = await User.findOne({ where: { user_email } });
    if (existing) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user_password, 10);
    // Crear usuario
    const user = await User.create({
      user_names,
      user_surenames,
      user_email,
      user_password: hashedPassword
    });
    res.status(201).json({ message: 'Usuario registrado', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

// Login de usuario
const login = async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    // Buscar usuario y roles asociados
    const user = await User.findOne({
      where: { user_email },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const valid = await bcrypt.compare(user_password, user.user_password);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    // Tomar el primer rol (o todos si lo prefieres)
    const userRole = user.roles && user.roles.length > 0 ? user.roles[0].role_name : null;
    // Generar token
    const token = jwt.sign({ user_id: user.user_id, role: userRole }, JWT_SECRET, { expiresIn: '8h' });
    res.status(200).json({ message: 'Login exitoso', token, user: {
      user_id: user.user_id,
      user_names: user.user_names,
      user_surenames: user.user_surenames,
      user_email: user.user_email,
      roles: user.roles.map(r => r.role_name)
    }});
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

const logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    tokenBlacklist.push(token);
  }
  res.status(200).json({ message: 'Logout exitoso' });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  if (tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: 'Inicia sesion para continuar' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Obtener datos del usuario actual
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'user_names', 'user_surenames', 'user_email'],
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      user_id: user.user_id,
      user_names: user.user_names,
      user_surenames: user.user_surenames,
      user_email: user.user_email,
      roles: user.roles.map(r => r.role_name)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

module.exports = {
  register,
  login,
  logout,
  authenticateToken,
  getCurrentUser
};
