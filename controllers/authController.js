const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { registroValidacion, loginValidacion } = require('../middleware/validacion');

const registro = async (req, res) => {
  try {
    const { error } = registroValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const { nombre, email, password, rol } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || 'Cliente'
    });

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'El correo electronico no existe.' });
    }

    const isValidPassword = user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña Incorrecta.' });
    }

    const token = jwt.sign(
      { 
        id_usuario: user.id_usuario, 
        email: user.email, 
        rol: user.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registro, login };