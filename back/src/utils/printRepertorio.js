const fs = require("fs").promises;
const path = require("node:path");

const { PDFDocument, rgb } = require("pdf-lib");

async function printRepertorio(docId, repertorio, date, folio) {
  // Load existing PDF
  const pdfName = `./PDF/${docId}/${docId}.pdf`;
  const existingPdfBytes = await fs.readFile(`./PDF/${docId}/${docId}.pdf`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const modifiedPdfBytes = await addBoxWithData(
    pdfDoc,
    repertorio,
    date,
    folio
  );
  await fs.writeFile(pdfName, modifiedPdfBytes);
}

async function addBoxWithData(pdfDoc, repertorio, date, folio) {
  let width;
  let height;
  const lockUrl = await fs.readFile(path.resolve("./assets/lock.png"));
  const lockImage = await pdfDoc.embedPng(lockUrl);

  const pages = pdfDoc.getPages();
  const page = pages[0];
  width = page.getSize().width;
  height = page.getSize().height;

  const boxWidth = 145;
  const boxHeight = 40;
  const boxX = 20;
  const boxY = height - 65;

  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 4,
  });

  const textX = boxX + 35;
  const textY = boxY - 35;
  const fontSize = 8;

  page.drawImage(lockImage, {
    x: boxX + 5,
    y: boxY + 5,
    width: 30,
    height: 30,
  });

  page.drawText(`Rep. Notaría: ${repertorio}`, {
    x: textX,
    y: textY + 60,
    size: fontSize,
  });

  page.drawText(`Folio TGR: ${folio}`, {
    x: textX,
    y: textY + 52,
    size: fontSize,
  });

  page.drawText(`${date}`, {
    x: textX,
    y: textY + 44,
    size: fontSize,
  });

  // Save the modified PDF
  return await pdfDoc.save({ useObjectStreams: false });
}

module.exports = { printRepertorio };
