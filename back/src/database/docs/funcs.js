const { getDate } = require("../../utils/getDate");
const { openConnection } = require("../../utils/mysql");

async function insertDoc(docId, total, count, hasRepertoire) {
  console.log("insertDoc");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO docs (docId, total, count, loadDate, finishDate, hasRepertoire) VALUES (?,?,?,?,?,?)",
      [
        parseInt(docId),
        parseInt(total),
        parseInt(count),
        getDate(),
        "",
        hasRepertoire,
      ],
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

async function updateDoc(docId, total, count, hasRepertoire) {
  const connection = await openConnection();
  console.log("updateDoc");
  const [doc] = await getDocById(docId);
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE docs SET count = ?, total = ?, hasRepertoire = ? WHERE docId = ?",
      [parseInt(count), parseInt(total), hasRepertoire, parseInt(docId)],
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

async function updateRepertoire(docId, repertoire) {
  console.log("updateRepertoire");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE docs SET repertoire = ? WHERE docId = ?",
      [`${repertoire}`, parseInt(docId)],
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

async function finishDoc(docId) {
  console.log("finishDoc");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE docs SET finishDate = ? WHERE docId = ?",
      [getDate(), parseInt(docId)],
      (error, result) => {
        if (error) {
          console.error("Error al guarda fecha de fin:", error);
          reject(error);
        }
        resolve(result);
      }
    );
  });
}

async function getDocById(docId) {
  console.log("getDocById");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM docs WHERE docId = ?",
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

module.exports = {
  insertDoc,
  updateDoc,
  getDocById,
  finishDoc,
  updateRepertoire,
};
