const sequelize = require("./database/database");
const app = require('./app');
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Probar la conexion a la base de datos
    await sequelize.authenticate().catch(() => {
      throw new Error('No se pudo conectar a la base de datos');
    });
    console.log('Conexión a la base de datos establecida');

    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log('Base de datos sincronizada');

    // Start server
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`API disponible en: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();