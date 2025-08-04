const { getAllDocs } = require("../database/general/getDocs");

const getAll = async (res) => {
  const results = await getAllDocs();
  // Objeto para almacenar los documentos y sus firmantes
  const documentsWithSigners = {};

  results.forEach((row) => {
    const docId = row.docDocId; // Utilizar el docId de la tabla docs

    if (!documentsWithSigners[docId]) {
      // Si el documento no está en el objeto, crear una entrada para él
      documentsWithSigners[docId] = {
        doc: {
          id: row.docPrimaryid, // Utilizar el id de la tabla docs
          docId: row.docDocId,
          repertorio: row.repertoire,
          total: row.total,
          count: row.count,
          loadDate: row.loadDate,
          finishDate: row.finishDate,
          hasRepertorio: !!row.hasRepertoire,
        },
        signers: [], // Inicializar el array de firmantes
      };
    }

    // Verificar si hay firmantes antes de agregarlos al array
    if (row.id !== null) {
      // Agregar el firmante al array de firmantes del documento
      documentsWithSigners[docId].signers.push({
        id: row.id, // Tomar el id del firmante
        nombre: row.nombre,
        city: row.city,
        rut: row.rut,
        email: row.email,
        signed: row.signed,
      });
    }
  });

  // Convertir el objeto en un array y mostrarlo
  const documentsArray = Object.values(documentsWithSigners);
  res
    .status(200)
    .json(documentsArray.sort((a, b) => b.doc.docId - a.doc.docId));
};
module.exports = { getAll };
