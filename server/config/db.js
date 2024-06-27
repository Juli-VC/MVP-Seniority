var mysql = require("mysql"); //Requerimos la librería mysql
require("dotenv").config();
//Configuración de la conexión con nuestro mysql workbench
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    throw error;
  } else {
    console.log("Conexión correcta");
  }
});

module.exports = connection;
