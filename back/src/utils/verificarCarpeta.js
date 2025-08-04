const fs = require("fs");
const path = require("path");

async function verificarYCrearCarpeta(id, object) {
  // Uso
  const directorioPrincipal = "./PDF"; // Reemplaza con la ruta de la carpeta principal
  const nombreCarpeta = id; // Nombre de la carpeta que quieres verificar
  // Obtener la ruta completa de la carpeta a verificar
  const rutaCarpeta = path.join(directorioPrincipal, nombreCarpeta);
  const rutaArchivo = path.join(rutaCarpeta, `${id}.pdf`);
  const modifiedPdfBytes = Buffer.from(object, "base64");

  try {
    // Verificar si la carpeta existe
    const exists = fs.existsSync(rutaCarpeta);

    if (!exists) {
      await fs.promises.mkdir(rutaCarpeta, { recursive: true });
    }
    // Escribir el archivo PDF (esto sobrescribirá el archivo si ya existe)
    if (exists) {
      await fs.promises.unlink(rutaArchivo);
    }
    await fs.promises.writeFile(rutaArchivo, modifiedPdfBytes);

    return exists;
  } catch (error) {
    console.error("Error al crear la carpeta o escribir el archivo:", error);
    throw error;
  }
}

module.exports = { verificarYCrearCarpeta };
