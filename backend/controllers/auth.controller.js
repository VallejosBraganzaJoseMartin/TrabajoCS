const User = require('../models/User.model');
const Role = require('../models/Role.model');
const Funcion = require('../models/Funcion.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendLoginNotification } = require('../services/email.service');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// Blacklist de tokens en memoria
const tokenBlacklist = [];


const register = async (req, res) => {
  const { user_names, user_surenames, user_email, user_password, role_id } = req.body;
  try {
  
    const existing = await User.findOne({ where: { user_email } });
    if (existing) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const user = await User.create({
      user_names,
      user_surenames,
      user_email,
      user_password: hashedPassword,
      role_id
    });
    res.status(201).json({ message: 'Usuario registrado', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

const login = async (req, res) => {
  const { user_email, user_password } = req.body;
  try {
    const user = await User.findOne({
      where: { user_email },
      include: [{
        model: Role,
        as: 'roles', 
        through: { attributes: [] }, 
        include: [{
          model: Funcion,
          as: 'funciones', 
          through: { attributes: [] },
          attributes: ['funcion_name'] 
        }]
      }]
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas', 
        details: 'Por favor, revise su correo electrónico o contraseña' 
      });
    }

    if (user.user_state === false) {
      return res.status(403).json({ 
        message: 'Cuenta desactivada', 
        details: 'Su cuenta ha sido desactivada. Contacte al administrador.' 
      });
    }

    const valid = await bcrypt.compare(user_password, user.user_password);
    if (!valid) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas', 
        details: 'Por favor, revise su correo electrónico o contraseña' 
      });
    }

    const userRoles = user.roles ? user.roles.map(role => ({
        role_id: role.role_id,
        role_name: role.role_name,
        funciones: role.funciones ? role.funciones.map(func => func.funcion_name) : []
    })) : [];

    const token = jwt.sign({
        user_id: user.user_id,
        user_email: user.user_email, 
        roles: userRoles 
    }, JWT_SECRET, { expiresIn: '8h' });

    // Enviar notificación de inicio de sesión por email (no bloqueante)
    const loginInfo = {
      ip: req.ip || req.connection?.remoteAddress || 'Desconocida'
    };
    sendLoginNotification(
      user.user_email, 
      `${user.user_names} ${user.user_surenames}`,
      loginInfo
    ).catch(err => console.error('Error enviando notificación:', err));

    res.status(200).json({
        message: 'Login exitoso',
        token,
        user: {
            user_id: user.user_id,
            user_names: user.user_names,
            user_surenames: user.user_surenames,
            user_email: user.user_email,
            roles: userRoles  
        }
    });

  } catch (error) {

    console.error('ERROR EN EL LOGIN DEL USUARIO:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
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

module.exports = {
  register,
  login,
  logout,
  authenticateToken
};
