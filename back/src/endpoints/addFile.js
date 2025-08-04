const { addFileToPdf } = require("../utils/addFileToPdf");

const addFile = async (data, res) => {
  const { numero_pedido, object } = data;

  await addFileToPdf(`./PDF/${numero_pedido}/${numero_pedido}.pdf`, object);

  return res.status(200).json({ message: "Archivo modificado correctamente" });
};

module.exports = { addFile };
