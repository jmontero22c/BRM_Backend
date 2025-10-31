const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { registroValidacion, loginValidacion } = require('../middleware/validacion');

const registrarUsuario = async (req, res) => {
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

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || 'Cliente'
    });

    const token = jwt.sign(
      { id_usuario: nuevoUsuario.id_usuario, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { error } = loginValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ error: 'El correo electrónico no está registrado' });
    }

    const isValidPassword = usuario.validatePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id_usuario: usuario.id_usuario, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { registrarUsuario, iniciarSesion };