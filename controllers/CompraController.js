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
    let totalCantidad = 0;
    const compraDetalles = [];

    // Verificar stock y calcular total
    for (const item of items) {
      const producto = await Producto.findByPk(item.id_producto, {transaction});

      if (!producto) {
        await transaction.rollback();
        return res.status(404).json({ error: `Producto con ID ${item.id_producto} no encontrado` });
      }

      if (producto.cantidad_disponible < item.cantidad) {
        await transaction.rollback();
        return res.status(400).json({
          error: `Stock insuficiente para el producto: ${producto.nombre}. Stock disponible: ${producto.cantidad_disponible}`,
        });
      }

      const subtotal = producto.precio * item.cantidad;
      totalCantidad += subtotal;

      compraDetalles.push({
        id_producto: producto.id_producto,
        cantidad: item.cantidad,
        precio_unitario: producto.precio,
      });

      // Actualizar stock
      await producto.update(
        { cantidad_disponible: producto.cantidad_disponible - item.cantidad },
        { transaction }
      );
    }

    // Crear compra
    const compra = await Compra.create(
      {
        id_usuario: req.user.id_usuario,
        total: totalCantidad,
      },
      { transaction }
    );

    // Crear Detalles de Compra
    for (const detail of compraDetalles) {
      await DetalleCompra.create(
        {
          ...detail,
          id_compra: compra.id_compra,
        },
        { transaction }
      );
    }

    await transaction.commit();

    // Obtener Compra completa con detalles
    const completePurchase = await Compra.findByPk(compra.id_compra, {
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
    console.error("Error al crear compra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Historial de compras
const getPurchaseHistory = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      where: { id_usuario: req.user.id_usuario },
      include: [
        {
          model: DetalleCompra,
          include: [Producto],
        },
      ],
      order: [["fecha_compra", "DESC"]],
    });

    res.json(compras);
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//Obtener compra especifica
const getPurchaseById = async (req, res) => {
  try {
    const compra = await Compra.findOne({
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

    if (!compra) {
      return res.status(404).json({ error: "Compra no encontrada" });
    }

    res.json(compra);
  } catch (error) {
    console.error("Error al obtener compra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todas las compras (Solo para administradores)
const getAllPurchases = async (req, res) => {
  try {
    const compras = await Compra.findAll({
      attributes: ["fecha_compra", "total"],
      include: [
        {
          model: DetalleCompra,
          include: [
            {
              model: Producto,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
          attributes: ["cantidad"],
        },
        {
          model: Usuario,
          attributes: ["email", "nombre", "rol"],
        },
      ],
      order: [["fecha_compra", "DESC"]],
    });

    res.json(compras);
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
