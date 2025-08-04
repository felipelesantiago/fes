const fs = require("fs-extra");
const path = require("path");

const getFile = async (data, res) => {
  const { docId } = data;

  const directorioPrincipal = "../../PDF"; // Reemplaza con la ruta de la carpeta principal
  const nombreCarpeta = docId; // Nombre de la carpeta que quieres verificar
  // Obtener la ruta completa de la carpeta a verificar
  const rutaCarpeta = path.join(
    `${__dirname}`,
    directorioPrincipal,
    `${docId}/${nombreCarpeta}.pdf`
  );
  try {
    const fileExists = await fs.pathExists(rutaCarpeta);
    if (!fileExists) {
      return res.status(404).json({ error: "Archivo no encontrado" });
    }
    const pdfBlob = await fs.readFile(rutaCarpeta);
    // Envía el archivo como respuesta
    res.setHeader("Content-Type", "application/pdf");
    return res.send(pdfBlob);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

module.exports = { getFile };
