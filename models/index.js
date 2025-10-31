const sequelize = require('../database/database');

const Usuario = require('./Usuarios');
const Producto = require('./Productos');
const Compra = require('./Compras');
const DetalleCompra = require('./DetalleCompras');

// Definir relaciones
Usuario.hasMany(Compra, { foreignKey: 'id_usuario' });
Compra.belongsTo(Usuario, { foreignKey: 'id_usuario' });

Compra.hasMany(DetalleCompra, { foreignKey: 'id_compra' });
DetalleCompra.belongsTo(Compra, { foreignKey: 'id_compra' });

Producto.hasMany(DetalleCompra, { foreignKey: 'id_producto' });
DetalleCompra.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = {
  sequelize,
  Usuario,
  Producto,
  Compra,
  DetalleCompra
};