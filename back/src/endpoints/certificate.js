const { signCertificate } = require("../utils/signCertificate.js");
const fs = require("fs").promises;
const {
  updateDoc,
  getDocById,
  finishDoc,
} = require("../database/docs/funcs.js");
const axios = require("axios");
const { insertSigners } = require("../database/firmantes/funcs.js");
const { printSign } = require("../utils/printSign.js");
const { getDate } = require("../utils/getDate.js");

const certificate = async (data, res) => {
  const { numero_pedido, apellido, nombre, rut, id_transaccion, city, email } =
    data;
  const [doc] = await getDocById(numero_pedido);
  const newCounter = parseInt(doc.count) + 1;
  if (newCounter > doc.total) {
    return res.status(200).json({
      message: `El documento ya posee el total de firmas: ${doc.total}`,
      type: "error",
    });
  }

  await printSign(
    numero_pedido,
    newCounter,
    nombre,
    apellido,
    rut,
    id_transaccion,
    email
  ).catch(console.error);

  await insertSigners(
    numero_pedido,
    `${nombre} ${apellido}`,
    city,
    rut,
    email,
    getDate(),
    true
  );

  await updateDoc(numero_pedido, doc.total, newCounter, doc.hasRepertoire);

  if (doc.total == newCounter) {
    if (!doc.hasRepertoire) {
      await signCertificate(numero_pedido).catch(console.error);
      await finishDoc(numero_pedido);
      const archivoPDF = await fs.readFile(
        `./PDF/${numero_pedido}/${numero_pedido}.pdf`
      );

      const postData = {
        numero_pedido: doc.docId,
        cantidadfirmantes: doc.total,
        firmasrealizadas: newCounter,
        object: archivoPDF,
      };

      axios
        .post(
          "https://hook.us1.make.com/hj2adagc8km3h2z63irprv6exyk5vo3d",
          postData
        )
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return res
        .status(200)
        .json({ message: "Enviado a Make con estos datos", postData });
    } else {
      const archivoPDF = await fs.readFile(
        `./PDF/${numero_pedido}/${numero_pedido}.pdf`
      );
      const postData = {
        numero_pedido: doc.docId,
        estado: "Esperando Repertorio",
        object: archivoPDF,
      };

      axios
        .post(
          "https://hook.us1.make.com/hj2adagc8km3h2z63irprv6exyk5vo3d",
          postData
        )
        .then((response) => {
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return res
        .status(200)
        .json({ message: "Enviado a Make con estos datos", postData });
    }
  }

  res
    .status(200)
    .json({ message: `Documento firmado, posee ${newCounter} firmas.` });
};

module.exports = { certificate };
