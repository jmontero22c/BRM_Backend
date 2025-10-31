const { Producto } = require('../models');
const { productoValidacion } = require('../middleware/validacion');

const getAllProducts = async (req, res) => {
  try {
    const products = await Producto.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Producto.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { error } = productoValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const existingProduct = await Producto.findOne({ 
      where: { numero_lote: req.body.numero_lote } 
    });
    
    if (existingProduct) {
      return res.status(400).json({ error: 'El número de lote ya existe' });
    }

    const product = await Producto.create(req.body);

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { error } = productoValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const product = await Producto.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el batch_number ya existe en otro producto
    if (req.body.numero_lote !== product.numero_lote) {
      const existingProduct = await Producto.findOne({ 
        where: { numero_lote: req.body.numero_lote } 
      });
      
      if (existingProduct) {
        return res.status(400).json({ error: 'El número de lote ya existe' });
      }
    }

    await product.update(req.body);

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Producto.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await product.destroy();

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};