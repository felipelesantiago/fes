const fs = require("fs").promises;
const path = require("node:path");

const { format } = require("date-fns");
const { PDFDocument, rgb } = require("pdf-lib");
const { getDate } = require("./getDate");

const boxPosition = [
  {
    boxX: 50,
    boxY: 165,
  },
  {
    boxX: 320,
    boxY: 165,
  },
  {
    boxX: 50,
    boxY: 270,
  },
  {
    boxX: 320,
    boxY: 270,
  },
  {
    boxX: 50,
    boxY: 375,
  },
  {
    boxX: 320,
    boxY: 375,
  },
  {
    boxX: 50,
    boxY: 480,
  },
  {
    boxX: 320,
    boxY: 480,
  },
  {
    boxX: 50,
    boxY: 585,
  },
  {
    boxX: 320,
    boxY: 585,
  },
  {
    boxX: 50,
    boxY: 690,
  },
  {
    boxX: 320,
    boxY: 690,
  },
];

async function printSign(
  docId,
  sign_count,
  nombre,
  apellido,
  rut,
  id_transaccion,
  email
) {
  // Load existing PDF
  const pdfName = `./PDF/${docId}/${docId}.pdf`;
  const existingPdfBytes = await fs.readFile(`./PDF/${docId}/${docId}.pdf`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const modifiedPdfBytes = await addBoxWithData(
    pdfDoc,
    sign_count,
    nombre,
    apellido,
    rut,
    id_transaccion,
    email
  );
  await fs.writeFile(pdfName, modifiedPdfBytes);
}

async function addBoxWithData(
  pdfDoc,
  number = "1",
  nombre,
  apellido,
  rut,
  id_transaccion,
  email
) {
  let signNumber = parseInt(number);
  // Create a new page
  let newPage;
  let width;
  let height;
  const lockUrl = await fs.readFile(path.resolve("./assets/lock.png"));
  const lockImage = await pdfDoc.embedPng(lockUrl);

  if (signNumber == 1 || (signNumber > 12 && signNumber % 12 == 1)) {
    const logoUrl = await fs.readFile(path.resolve("./assets/logo.png"));
    const logoImage = await pdfDoc.embedPng(logoUrl);

    const [page] = pdfDoc.getPages();
    width = page.getSize().width;
    height = page.getSize().height;
    newPage = pdfDoc.addPage([width, height]);
    newPage.drawImage(logoImage, {
      x: 265,
      y: height - 65,
      width: 75,
      height: 50,
    });
  } else {
    const pages = pdfDoc.getPages();
    width = pages[pages.length - 1].getSize().width;
    height = pages[pages.length - 1].getSize().height;
    newPage = pages[pages.length - 1];
  }

  if (signNumber > 12) {
    signNumber = signNumber % 12;
  }
  // Add a box with border and text
  const boxWidth = 230;
  const boxHeight = 80;
  const boxX = boxPosition[signNumber - 1].boxX;

  const boxY = height - boxPosition[signNumber - 1].boxY;

  newPage.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    borderColor: rgb(0.5, 0.5, 0.5),
    borderWidth: 4,
  });

  const textX = boxX + 50;
  const textY = boxY + 10;
  const fontSize = 8;

  newPage.drawImage(lockImage, {
    x: boxX - 5,
    y: boxY + 20,
    width: 60,
    height: 60,
  });

  let nombreCompleto = `${nombre} ${apellido}`;
  let jumpLine = 0;
  if (nombreCompleto.length > 28) {
    jumpLine = 8;
    newPage.drawText(`Nombre: ${nombre}`, {
      x: textX,
      y: textY + 56,
      size: fontSize,
    });
    newPage.drawText(`${apellido}`, {
      x: textX,
      y: textY + 56 - 8,
      size: fontSize,
    });
  } else {
    newPage.drawText(`Nombre: ${nombre} ${apellido}`, {
      x: textX,
      y: textY + 56,
      size: fontSize,
    });
  }

  newPage.drawText(`ID Doc: ${rut}`, {
    x: textX,
    y: textY + 48 - jumpLine,
    size: fontSize,
  });

  newPage.drawText(`Email: ${email}`, {
    x: textX,
    y: textY + 40 - jumpLine,
    size: fontSize,
  });

  newPage.drawText(`ID Transacción: ${id_transaccion}`, {
    x: boxX + 5,
    y: textY - 6,
    size: 6,
  });

  newPage.drawText(`Firmado electrónicamente el: ${getDate()}`, {
    x: boxX + 5,
    y: textY,
    size: 6,
  });

  newPage.drawLine({
    start: { x: 270, y: height - 40 },
    end: { x: 15, y: height - 40 },
    thickness: 1,
    color: rgb(0.502, 0, 0.2235),
    opacity: 1,
  });

  newPage.drawLine({
    start: { x: width - 15, y: height - 40 },
    end: { x: width - 270, y: height - 40 },
    thickness: 1,
    color: rgb(0.502, 0, 0.2235),
    opacity: 1,
  });

  newPage.drawLine({
    start: { x: 15, y: height - 40 },
    end: { x: 15, y: height - (height - 20) },
    thickness: 1,
    color: rgb(0.502, 0, 0.2235),
    opacity: 1,
  });

  newPage.drawLine({
    start: { x: 15, y: height - (height - 20) },
    end: { x: width - 15, y: height - (height - 20) },
    thickness: 1,
    color: rgb(0.502, 0, 0.2235),
    opacity: 1,
  });

  newPage.drawLine({
    start: { x: width - 15, y: height - (height - 20) },
    end: { x: width - 15, y: height - 40 },
    thickness: 1,
    color: rgb(0.502, 0, 0.2235),
    opacity: 1,
  });

  // Save the modified PDF
  return await pdfDoc.save({ useObjectStreams: false });
}

module.exports = { printSign };
