const { sign } = require("@signpdf/signpdf");
var plainAddPlaceholder =
  require("@signpdf/placeholder-plain").plainAddPlaceholder;
var signpdf = require("@signpdf/signpdf").default;
var P12Signer = require("@signpdf/signer-p12").P12Signer;
const forge = require("node-forge");
const { getSigners } = require("../database/firmantes/funcs");
const { getDate } = require("./getDate");
const { parse } = require("date-fns");
const fs = require("fs").promises;
require("dotenv").config();

async function signCertificate(docId) {
  // Generate a key pair
  const signers = await getSigners(docId);
  for (const signerInfo of signers) {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const pdfName = `./PDF/${docId}/${docId}.pdf`;
    // Create a certificate
    const cert = forge.pki.createCertificate();
    const date = parse(signerInfo.fecha, "d/M/yyyy, h:mm:ss a", new Date());
    cert.publicKey = keys.publicKey;
    cert.serialNumber = "01";
    cert.validity.notBefore = date;
    cert.validity.notAfter = date;
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    const attrsIssuer = [
      {
        name: "commonName",
        value: "Tu Patrimonio SpA <contacto@tupatrimonio.cl>",
      },
      { name: "countryName", value: "CL" },
      { shortName: "ST", value: "Providencia" },
      { name: "localityName", value: "Providencia" },
      { name: "organizationName", value: "Tu Patrimonio SpA" },
      { shortName: "OU", value: "Providencia, Chile" },
    ];
    const attrsSub = [
      {
        name: "commonName",
        value: `${signerInfo.nombre}`,
      },
      { name: "countryName", value: "CL" },
      { shortName: "ST", value: signerInfo.city },
      { name: "localityName", value: signerInfo.city },
      { name: "organizationName", value: signerInfo.nombre },
      { shortName: "OU", value: signerInfo.city },
    ];
    cert.setSubject(attrsSub);
    cert.setIssuer(attrsIssuer);
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
    var sourcePath = `./PDF/${docId}/${docId}.pdf`;
    var pdfBuffer = await fs.readFile(sourcePath);

    // certificate.p12 is the certificate that is going to be used to sign
    var certificatePath = "./assets/cert/certificate.p12";
    var certificateBuffer = await fs.readFile(certificatePath);
    var signer = new P12Signer(certificateBuffer);

    // The PDF needs to have a placeholder for a signature to be signed.
    var pdfWithPlaceholder = plainAddPlaceholder({
      pdfBuffer: pdfBuffer,
      reason: `Firma Electronica`,
      contactInfo: `contacto@tupatrimonio.cl`,
      name: signerInfo.nombre,
      location: signerInfo.city,
    });
    // pdfWithPlaceholder is now a modified buffer that is ready to be signed.
    await signpdf.sign(pdfWithPlaceholder, signer).then(function (signedPdf) {
      // signedPdf is a Buffer of an electronically signed PDF. Store it.
      var targetPath = pdfName;
      fs.writeFile(targetPath, signedPdf);
    });
  }
}

module.exports = { signCertificate };
