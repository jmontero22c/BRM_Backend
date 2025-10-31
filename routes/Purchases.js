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
router.post('/', authenticate, authorize('Cliente'), createPurchase);
router.get('/history', authenticate, authorize('Cliente'), getPurchaseHistory);
router.get('/:id', authenticate, getPurchaseById);

// Administradores
router.get('/', authenticate, authorize('Administrador'), getAllPurchases);

module.exports = router;