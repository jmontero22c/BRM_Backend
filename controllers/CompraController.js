const { Compra, DetalleCompra, Producto, Usuario } = require("../models");
const { compraValidacion } = require("../middleware/validacion");

const createPurchase = async (req, res) => {
  const transaction = await require("../database/database").transaction();

  try {
    const { error } = compraValidacion(req.body);
    if (error) {
      return res.status(400).json({ error: error });
    }

    const { items } = req.body;
    let totalAmount = 0;
    const compraDetalles = [];

    // Verificar stock y calcular total
    for (const item of items) {
      const product = await Producto.findByPk(item.id_producto, {
        transaction,
      });

      if (!product) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ error: `Producto con ID ${item.id_producto} no encontrado` });
      }

      if (product.cantidad_disponible < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para el producto: ${product.nombre}. Stock disponible: ${product.cantidad_disponible}`,
        });
      }

      const subtotal = product.precio * item.cantidad;
      totalAmount += subtotal;

      compraDetalles.push({
        id_producto: product.id_producto,
        cantidad: item.cantidad,
        precio_unitario: product.precio,
      });

      // Actualizar stock
      await product.update(
        { cantidad_disponible: product.cantidad_disponible - item.cantidad },
        { transaction }
      );
    }

    // Crear compra
    const purchase = await Compra.create(
      {
        id_usuario: req.user.id_usuario,
        total_amount: totalAmount,
      },
      { transaction }
    );

    // Crear Detalles de Compra
    for (const detail of compraDetalles) {
      await DetalleCompra.create(
        {
          ...detail,
          id_compra: purchase.id_compra,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Obtener Compra completa con detalles
    const completePurchase = await Compra.findByPk(purchase.id_compra, {
      include: [
        {
          model: DetalleCompra,
          include: [Producto],
        },
      ],
    });

    res.status(201).json({
      message: "Compra realizada exitosamente",
      compra: completePurchase,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear purchase:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Historial de compras
const getPurchaseHistory = async (req, res) => {
  try {
    const purchases = await Compra.findAll({
      where: { id_usuario: req.params.id_usuario },
      include: [
        {
          model: DetalleCompra,
          include: [Producto],
        },
      ],
      order: [["fecha_compra", "DESC"]],
    });

    res.json(purchases);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Obtener compra especifica
const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Compra.findOne({
      where: {
        id_compra: req.params.id,
        id_usuario:
          req.user.rol === "Cliente" ? req.user.id_usuario : undefined,
      },
      include: [
        {
          model: DetalleCompra,
          include: [Producto],
        },
        {
          model: Usuario,
          attributes: ["id_usuario", "email"],
        },
      ],
    });

    if (!purchase) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    res.json(purchase);
  } catch (error) {
    console.error("Error al obtener compra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las compras (Solo para administradores)
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Compra.findAll({
      include: [
        {
          model: DetalleCompra,
          include: [Producto],
        },
        {
          model: Usuario,
          attributes: ["id_usuario", "email", "rol"],
        },
      ],
      order: [["fecha_compra", "DESC"]],
    });

    res.json(purchases);
  } catch (error) {
    console.error("Error al obtener todas las compras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  createPurchase,
  getPurchaseHistory,
  getPurchaseById,
  getAllPurchases,
};
