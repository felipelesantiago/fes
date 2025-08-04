const mysql = require("mysql");

async function openConnection() {
  // Configuración de la conexión a la base de datos
  const connection = mysql.createConnection({
    host: process.env.DB_HOST, // Cambia esto por la dirección de tu servidor MySQL
    user: process.env.DB_USER, // Cambia esto por el nombre de usuario de tu base de datos
    password: process.env.DB_PASSWORD, // Cambia esto por la contraseña de tu base de datos
    database: process.env.DB_DATABASE, // Cambia esto por el nombre de tu base de datos
  });

  // Conectar a la base de datos
  connection.connect((err) => {
    if (err) {
      console.error("Error al conectar a la base de datos:", err);
      return;
    }
    console.log("Conexión exitosa a la base de datos MySQL");
  });
  return connection;
}

async function closeConnection() {
  // Cerrar la conexión a la base de datos cuando hayas terminado
  connection.end((err) => {
    if (err) {
      console.error("Error al cerrar la conexión:", err);
      return;
    }
    console.log("Conexión cerrada exitosamente");
  });
}

module.exports = { openConnection, closeConnection };
