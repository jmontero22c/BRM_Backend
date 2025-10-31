const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/ProductoController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Público
/**
 * @api {get} /products Listar productos
 * @apiName GetProducts
 * @apiGroup Productos
 * @apiVersion 1.0.0
 *
 * @apiDescription Obtiene la lista de todos los productos disponibles. Acceso público.
 *
 * @apiSuccess {Number} id_producto ID del producto
 * @apiSuccess {String} numero_lote Número de lote
 * @apiSuccess {String} nombre Nombre del producto
 * @apiSuccess {String} precio Precio del producto
 * @apiSuccess {Number} cantidad_disponible Cantidad en stock
 * @apiSuccess {String} fecha_ingreso Fecha de ingreso (YYYY-MM-DD)
 * @apiSuccess {String} createdAt Fecha de creación
 * @apiSuccess {String} updatedAt Fecha de actualización
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "id_producto": 1,
 *         "numero_lote": "LOTE-001",
 *         "nombre": "Laptop Dell XPS 13",
 *         "precio": "1299.99",
 *         "cantidad_disponible": 50,
 *         "fecha_ingreso": "2024-01-15",
 *         "createdAt": "2024-01-15T10:00:00.000Z",
 *         "updatedAt": "2024-01-15T10:00:00.000Z"
 *       }
 *     ]
 *  @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.get('/', getAllProducts);

/**
 * @api {get} /products/:id Obtener producto por ID
 * @apiName GetProduct
 * @apiGroup Productos
 * @apiVersion 1.0.0
 * @apiDescription Obtiene un producto específico por su ID. Acceso público.
 *
 * @apiParam {Number} id ID único del producto
 *
 * @apiSuccess {Number} id_producto ID del producto
 * @apiSuccess {String} numero_lote Número de lote
 * @apiSuccess {String} nombre Nombre del producto
 * @apiSuccess {String} precio Precio del producto
 * @apiSuccess {Number} cantidad_disponible Cantidad en stock
 * @apiSuccess {String} fecha_ingreso Fecha de ingreso (YYYY-MM-DD)
 * @apiSuccess {String} createdAt Fecha de creación
 * @apiSuccess {String} updatedAt Fecha de actualización
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "id_producto": 1,
 *       "numero_lote": "LOTE-001",
 *       "nombre": "Laptop Dell XPS 13",
 *       "precio": "1299.99",
 *       "cantidad_disponible": 50,
 *       "fecha_ingreso": "2024-01-15",
 *       "createdAt": "2024-01-15T10:00:00.000Z",
 *       "updatedAt": "2024-01-15T10:00:00.000Z"
 *     }
 *     
 * @apiError (Error 404) {String} error Mensaje de producto no encontrado. 
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.get('/:id', getProductById);

// Solo administradores
/**
 * @api {post} /products Crear producto
 * @apiName CreateProduct
 * @apiGroup Productos
 * @apiVersion 1.0.0
 * @apiDescription Crea un nuevo producto en el inventario. Solo accesible para administradores.
 * @apiPermission Administrador
 *
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiBody {String} numero_lote Número de lote (único)
 * @apiBody {String} nombre Nombre del producto
 * @apiBody {Number} precio Precio del producto
 * @apiBody {Number} cantidad_disponible Cantidad disponible
 * @apiBody {String} fecha_ingreso Fecha de ingreso (YYYY-MM-DD)
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} product Producto creado
 * @apiSuccess {Number} product.id_producto ID del producto
 * @apiSuccess {String} product.numero_lote Número de lote
 * @apiSuccess {String} product.nombre Nombre del producto
 * @apiSuccess {Number} product.precio Precio del producto
 * @apiSuccess {Number} product.cantidad_disponible Cantidad en stock
 * @apiSuccess {String} product.fecha_ingreso Fecha de ingreso (YYYY-MM-DD)
 * @apiSuccess {String} product.createdAt Fecha de creación
 * @apiSuccess {String} product.updatedAt Fecha de actualización
 * 
 * @apiSuccessExample {json} Success-Response:  
 *    HTTP/1.1 201 Created
 *    {
 *     "message": "Producto creado exitosamente",
 *     "product": {
 *        "id_producto": 1,
 *        "numero_lote": "LOTE-001",
 *        "nombre": "Laptop Dell XPS 13",
 *        "precio": 1299.99,
 *        "cantidad_disponible": 50,
 *        "fecha_ingreso": "2024-01-15",
 *        "createdAt": "2024-01-15T10:00:00.000Z",
 *        "updatedAt": "2024-01-15T10:00:00.000Z"
 *      }
 *    }
 *
 * @apiError (Error 400) {String} error Estado de error
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.post('/', authenticate, authorize('Administrador'), createProduct);
/**
 * @api {put} /products/:id Actualizar producto
 * @apiName UpdateProduct
 * @apiGroup Productos
 * @apiVersion 1.0.0
 * @apiDescription Actualiza los detalles de un producto existente. Solo accesible para administradores.
 * @apiPermission Administrador
 * 
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiParam {Number} id ID único del producto
 * @apiBody {String} [numero_lote] Número de lote
 * @apiBody {String} [nombre] Nombre del producto
 * @apiBody {Number} [precio] Precio del producto
 * @apiBody {Number} [cantidad_disponible] Cantidad disponible
 * @apiBody {String} [fecha_ingreso] Fecha de ingreso
 * 
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccess {Object} product Producto creado
 * @apiSuccess {Number} product.id_producto ID del producto
 * @apiSuccess {String} product.numero_lote Número de lote
 * @apiSuccess {String} product.nombre Nombre del producto
 * @apiSuccess {Number} product.precio Precio del producto
 * @apiSuccess {Number} product.cantidad_disponible Cantidad en stock
 * @apiSuccess {String} product.fecha_ingreso Fecha de ingreso (YYYY-MM-DD)
 * @apiSuccess {String} product.createdAt Fecha de creación
 * @apiSuccess {String} product.updatedAt Fecha de actualización
 * 
 * @apiSuccessExample {json} Success-Response:  
 *    HTTP/1.1 201 OK
 *    {
 *     "message": "Producto actualizado exitosamente",
 *     "product": {
 *        "id_producto": 1,
 *        "numero_lote": "LOTE-001",
 *        "nombre": "Laptop Dell XPS 13",
 *        "precio": 1299.99,
 *        "cantidad_disponible": 50,
 *        "fecha_ingreso": "2024-01-15",
 *        "createdAt": "2024-01-15T10:00:00.000Z",
 *        "updatedAt": "2024-01-15T10:00:00.000Z"
 *      }
 *    }
 * 
 * @apiError (Error 400) {String} error Estado de error
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.put('/:id', authenticate, authorize('Administrador'), updateProduct);

/**
 * @api {delete} /products/:id Eliminar producto
 * @apiName DeleteProduct
 * @apiGroup Productos
 * @apiVersion 1.0.0
 * @apiPermission Administrador
 * @apiDescription Elimina un producto del inventario. Solo accesible para administradores.
 * 
 * @apiHeader {String} Authorization Token JWT en formato `Bearer <token>`.
 *
 * @apiParam {Number} id ID único del producto
 *
 * @apiSuccess {String} message Mensaje de confirmación
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK 
 *   {
 *     "message": "Producto eliminado exitosamente"
 *   }
 * 
 * @apiError (Error 500) {String} error Mensaje de error interno.
 */
router.delete('/:id', authenticate, authorize('Administrador'), deleteProduct);

module.exports = router;