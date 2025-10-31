const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/database");

class Compra extends Model {}

Compra.init(
  {
    id_compra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Usuarios",
        key: "id_usuario",
      },
    },
    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: "Compra", 
  }
);

module.exports = Compra;
