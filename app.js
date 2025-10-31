const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/Productos');
const purchaseRoutes = require('./routes/Purchases');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/purchases', purchaseRoutes);

//Documentacion
app.use('/docs', express.static(path.resolve('apidoc')));

// Error handler
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;