const { default: axios } = require("axios");
const {
  getDocById,
  finishDoc,
  updateRepertoire,
} = require("../database/docs/funcs");
const { getSignersOrderBy } = require("../database/firmantes/funcs");
const { printRepertorio } = require("../utils/printRepertorio");
const { signCertificate } = require("../utils/signCertificate");
const { addFileToPdf } = require("../utils/addFileToPdf");
const fs = require("fs").promises;

const repertorio = async (data, res) => {
  const { repertorio, numero_pedido, object, folio } = data;
  const [doc] = await getDocById(numero_pedido);
  const signers = await getSignersOrderBy(numero_pedido, "fecha", "DESC");
  if (object) {
    await addFileToPdf(`./PDF/${numero_pedido}/${numero_pedido}.pdf`, object);
  }
  await printRepertorio(numero_pedido, repertorio, signers[0].fecha, folio);
  await signCertificate(numero_pedido).catch(console.error);
  await finishDoc(numero_pedido).catch(console.error);
  await updateRepertoire(numero_pedido, repertorio).catch(console.error);
  const archivoPDF = await fs.readFile(
    `./PDF/${numero_pedido}/${numero_pedido}.pdf`
  );

  const postData = {
    numeropedido: doc.docId,
    cantidadfirmantes: doc.total,
    firmasrealizadas: doc.total,
    object: archivoPDF,
    repertorio: repertorio,
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
};

module.exports = { repertorio };
