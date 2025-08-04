const { openConnection } = require("../../utils/mysql");

async function insertSigners(docId, nombre, city, rut, email, date, signed) {
  console.log("insertSigners");
  const connection = await openConnection();

  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO signers (docId, nombre, city, rut, email, signed, fecha) VALUES (?,?,?,?,?,?,?)",
      [parseInt(docId), nombre, city, rut, email, signed, date],
      (error, result) => {
        if (error) {
          console.error("Error al crear documento de la base de datos:", error);
          reject(error);
        }
        resolve(result);
      }
    );
  });
}

async function getSigners(docId) {
  console.log("getSigners");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM signers WHERE docId = ?",
      [docId],
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function getSignersOrderBy(docId, order, orderDirection) {
  console.log("getSignersOrderBy");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM signers WHERE docId = ? ORDER BY ${connection.escapeId(
        order
      )} ${orderDirection}`,
      [docId],
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

module.exports = { insertSigners, getSigners, getSignersOrderBy };
