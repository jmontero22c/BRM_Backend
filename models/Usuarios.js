const { DataTypes, Model } = require("sequelize");
const sequelize = require("../database/database");

class Usuario extends Model {}

Usuario.init(
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("Administrador", "Cliente"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Usuario',
  }
);

Usuario.prototype.validatePassword = function(password) {
  return password === this.password;
};

module.exports = Usuario;
