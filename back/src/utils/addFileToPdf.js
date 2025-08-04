const fs = require("fs").promises;
const { PDFDocument } = require("pdf-lib");

const addFileToPdf = async (pdf1Path, pdf2Bytes) => {
  const pdf1Bytes = await fs.readFile(pdf1Path);
  const pdf1Doc = await PDFDocument.load(pdf1Bytes);
  const modifiedPdfBytes = Buffer.from(pdf2Bytes, "base64");
  const pdf2Doc = await PDFDocument.load(modifiedPdfBytes);

  // Copia las páginas del segundo PDF al primer PDF
  const pdf2Pages = await pdf1Doc.copyPages(pdf2Doc, pdf2Doc.getPageIndices());

  // Calcula el índice en el que insertar las páginas del segundo PDF
  const pdf1PageCount = pdf1Doc.getPageCount();
  const insertIndex = pdf1PageCount - 1;

  // Inserta las páginas del segundo PDF antes de la antepenúltima página del primer PDF
  pdf2Pages.forEach((page, idx) => {
    pdf1Doc.insertPage(insertIndex + idx, page);
  });

  // Guarda el PDF fusionado
  const mergedPdfBytes = await pdf1Doc.save();
  fs.writeFile(pdf1Path, mergedPdfBytes);
};

module.exports = { addFileToPdf };
