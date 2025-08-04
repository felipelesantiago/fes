const randomNumber = Math.floor(Math.random() * 5000);
const pdfName = `./exports/exported_file_${randomNumber}.pdf`;
import path from "node:path";
import { getDate } from "./utils/getDate";
const forge = require("node-forge");
const { sign } = require("@signpdf/signpdf");
var plainAddPlaceholder =
  require("@signpdf/placeholder-plain").plainAddPlaceholder;
var signpdf = require("@signpdf/signpdf").default;
var P12Signer = require("@signpdf/signer-p12").P12Signer;

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
const { format } = require("date-fns");
const {
  PDFDocument,
  rgb,
  PDFDocumentFactory,
  PDFDocumentWriter,
  StandardFonts,
} = require("pdf-lib");
const fs = require("fs").promises;

// Load the existing PDF
const newPDF = pdfName; // Path to save the modified PDF
// Read existing PDF file
async function addPageWithTextBox() {
  // Load existing PDF
  const existingPdfBytes = await fs.readFile("./exports/test.pdf");
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const modifiedPdfBytes = await addBoxWithData(pdfDoc, true, 1);
  await fs.writeFile(pdfName, modifiedPdfBytes);
}

async function addBoxWithData(pdfDoc, needNewPage = false, signNumber = 1) {
  // Create a new page
  let newPage;
  let width;
  let height;
  const lockUrl = await fs.readFile(path.resolve("./assets/lock.png"));
  const lockImage = await pdfDoc.embedPng(lockUrl);

  if (needNewPage || signNumber % 12 === 0) {
    const logoUrl = await fs.readFile(path.resolve("./assets/logo.png"));
    const logoImage = await pdfDoc.embedPng(logoUrl);

    const [page] = pdfDoc.getPages();
    width = page.getSize().width;
    height = page.getSize().height;
    newPage = pdfDoc.addPage([width, height]);
    newPage.drawImage(logoImage, {
      x: 270,
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
    y: boxY + 10,
    width: 60,
    height: 60,
  });

  newPage.drawText("Name: John", {
    x: textX,
    y: textY + 56,
    size: fontSize,
  });

  newPage.drawText("City: New York", {
    x: textX,
    y: textY + 48,
    size: fontSize,
  });

  newPage.drawText("Id: 005515154514", {
    x: textX,
    y: textY + 40,
    size: fontSize,
  });

  newPage.drawText(`Fecha y Hora: ${getDate()}`, {
    x: textX,
    y: textY + 32,
    size: fontSize,
  });

  newPage.drawText(`ID Transacción: E3F4D1F4-DB673`, {
    x: textX,
    y: textY + 24,
    size: fontSize,
  });

  newPage.drawText(`IP: 127.164.1.1`, {
    x: textX,
    y: textY + 16,
    size: fontSize,
  });

  newPage.drawText(`User Agent: Mozilla `, {
    x: textX,
    y: textY + 8,
    size: fontSize,
  });

  newPage.drawText(`Longitud y Latitud: 127.147 - 214.152 `, {
    x: textX,
    y: textY,
    size: fontSize,
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
  return await pdfDoc.save();
}

//addPageWithTextBox().catch(console.error);

// Load the existing PDF document

async function signPdf() {
  // Generate a key pair
  const keys = forge.pki.rsa.generateKeyPair(2048);

  // Create a certificate
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = getDate();
  cert.validity.notAfter = getDate();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  const attrs = [
    { name: "commonName", value: "Matias asdBlanco" },
    { name: "countryName", value: "US" },
    { shortName: "ST", value: "California" },
    { name: "localityName", value: "San Francisco" },
    { name: "organizationName", value: "Example, Inc." },
    { shortName: "OU", value: "Test" },
  ];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey);

  // Convert the certificate and private key to PEM format
  const certPem = forge.pki.certificateToPem(cert);
  const keyPem = forge.pki.privateKeyToPem(keys.privateKey);

  // Convert the certificate and private key to PKCS#12 format
  const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
    keys.privateKey,
    [cert],
    "" // Set your desired password here
  );
  const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

  // Write the PKCS#12 certificate to a file
  await fs.writeFile(
    "./assets/cert/certificate.p12",
    Buffer.from(p12Der, "binary")
  );

  // contributing.pdf is the file that is going to be signed
  var sourcePath = "./exports/test.pdf";
  var pdfBuffer = await fs.readFile(sourcePath);

  // certificate.p12 is the certificate that is going to be used to sign
  var certificatePath = "./assets/cert/certificate.p12";
  var certificateBuffer = await fs.readFile(certificatePath);
  var signer = new P12Signer(certificateBuffer);

  // The PDF needs to have a placeholder for a signature to be signed.
  var pdfWithPlaceholder = plainAddPlaceholder({
    pdfBuffer: pdfBuffer,
    reason: "The user is decalaring consent through JavaScript.",
    contactInfo: "signpdf@example.com",
    name: "John Doe",
    location: "Free Text Str., Free World",
  });

  // pdfWithPlaceholder is now a modified buffer that is ready to be signed.
  signpdf.sign(pdfWithPlaceholder, signer).then(function (signedPdf) {
    // signedPdf is a Buffer of an electronically signed PDF. Store it.
    var targetPath = pdfName;
    fs.writeFile(targetPath, signedPdf);
  });
}

signPdf().catch(console.error);
