const express = require('express');
const { 
  createPurchase, 
  getPurchaseById, 
  getAllPurchases,
  getPurchaseHistory
} = require('../controllers/CompraController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Clientes
/**
 * @api {post} /purchases Realizar compra
 * @apiName CreatePurchase
 * @apiGroup Compras
 * @apiVersion 1.0.0
 * @apiPermission Cliente
 *
 * @apiDescription Permite a un cliente realizar una compra de uno o varios productos
 * 
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiBody {Object[]} items Lista de productos a comprar
 * @apiBody {Number} items.id_producto ID del producto
 * @apiBody {Number} items.cantidad Cantidad a comprar
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "items": [
 *         {
 *           "id_producto": 1,
 *           "cantidad": 2
 *         },
 *         {
 *           "id_producto": 3,
 *           "cantidad": 1
 *         }
 *       ]
 *     }
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} compra Compra realizada con detalles
 * @apiSuccess {Number} compra.id_compra ID de la compra
 * @apiSuccess {Number} compra.id_usuario ID del usuario
 * @apiSuccess {String} compra.fecha_compra Fecha de la compra
 * @apiSuccess {Number} compra.total Monto total
 * @apiSuccess {Object[]} compra.DetalleCompras Detalles de la compra
 * @apiSuccess {Object} compra.DetalleCompras.Producto Información del producto
 *
 * @apiError (Error 400) {String} error Stock insuficiente o producto no encontrado
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.post('/', authenticate, authorize('Cliente'), createPurchase);

/**
 * @api {get} /purchases/history Historial de compras
 * @apiName GetPurchaseHistory
 * @apiGroup Compras
 * @apiVersion 1.0.0
 * @apiPermission Cliente
 *
 * @apiDescription Obtiene el historial de compras del usuario autenticado
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiSuccess {Object[]} data Lista de compras del usuario
 * 
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.get('/history', authenticate, authorize('Cliente'), getPurchaseHistory);

/**
 * @api {get} /purchases/:id Obtener compra específica
 * @apiName GetPurchase
 * @apiGroup Compras
 * @apiVersion 1.0.0
 *
 * @apiDescription Obtiene los detalles de una compra específica. Los clientes solo pueden ver sus propias compras.
 *
 * @apiParam {Number} id ID de la compra
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiSuccess {Object} data Datos de la compra
 * 
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.get('/:id', authenticate, getPurchaseById);

// Administradores
/**
 * @api {get} /purchases Listar todas las compras
 * @apiName GetAllPurchases
 * @apiGroup Compras
 * @apiVersion 1.0.0
 * @apiPermission Administrador
 *
 * @apiDescription Obtiene todas las compras del sistema. Solo para administradores.
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiSuccess {Object[]} data Lista de todas las compras
 * 
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.get('/', authenticate, authorize('Administrador'), getAllPurchases);

module.exports = router;