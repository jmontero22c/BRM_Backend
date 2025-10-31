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
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Solo administradores
router.post('/', authenticate, authorize('Administrador'), createProduct);
router.put('/:id', authenticate, authorize('Administrador'), updateProduct);
router.delete('/:id', authenticate, authorize('Administrador'), deleteProduct);

module.exports = router;