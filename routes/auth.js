const express = require('express');
const { registrarUsuario, iniciarSesion } = require('../controllers/authController');

const router = express.Router();

/**
 * @api {post} /auth/register Registrar usuario
 * @apiName RegisterUser
 * @apiGroup Autenticación
 * @apiVersion 1.0.0
 *
 * @apiBody {String} nombre Nombre del usuario
 * @apiBody {String} email Email del usuario (debe ser único)
 * @apiBody {String} password Contraseña (mínimo 6 caracteres)
 * @apiBody {String="Administrador","Cliente"} [rol="Cliente"] Rol del usuario
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {String} token Token JWT para autenticación
 * @apiSuccess {Object} usuario Datos del usuario registrado
 * @apiSuccess {Number} usuario.id_usuario ID del usuario
 * @apiSuccess {String} usuario.nombre Nombre del usuario
 * @apiSuccess {String} usuario.email Email del usuario
 * @apiSuccess {String} usuario.rol Rol del usuario
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Usuario registrado exitosamente",
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "usuario": {
 *         "id_usuario": 1,
 *         "nombre": "Anonimo",
 *         "email": "usuario@ejemplo.com",
 *         "rol": "Cliente"
 *       }
 *     }
 *
 * @apiError (Error 400) {String} error Mensaje de error
 * @apiError (Error 500) {String} error Mensaje de error interno.
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "El email ya está registrado"
 *     }
 */
router.post('/register', registrarUsuario);

/**
 * @api {post} /auth/login Iniciar sesión
 * @apiName LoginUser
 * @apiGroup Autenticación
 * @apiVersion 1.0.0
 *
 * @apiBody {String} email Email del usuario.
 * @apiBody {String} password Contraseña del usuario.
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiSuccess {String} token Token JWT para autenticación.
 * @apiSuccess {Object} usuario Datos del usuario.
 * @apiSuccess {Number} usuario.id_usuario ID del usuario.
 * @apiSuccess {String} usuario.nombre Nombre del usuario.
 * @apiSuccess {String} usuario.email Email del usuario.
 * @apiSuccess {String} usuario.role Rol del usuario.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Logged In
 *     {
 *       "message": "Inicio de sesión exitoso",
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *       "usuario": {
 *         "id_usuario": 1,
 *         "nombre": "Anonimo",
 *         "email": "usuario@ejemplo.com",
 *         "rol": "Cliente"
 *       }
 *     }
 *
 * @apiError (Error 400) {String} error Credenciales inválidas.
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.post('/login', iniciarSesion);

module.exports = router;