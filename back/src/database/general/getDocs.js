const { openConnection } = require("../../utils/mysql");

async function getAllDocs() {
  console.log("getAllDocs");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT docs.*, docs.id AS docPrimaryid, docs.docId AS docDocId, signers.* FROM docs LEFT JOIN signers ON docs.docId = signers.docId ORDER BY docs.docId DESC",
      (error, results) => {
        if (error) {
          console.error("Error al realizar la consulta:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

module.exports = { getAllDocs };
