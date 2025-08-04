const { signCertificate } = require("../utils/signCertificate");

const resign = async (data, res) => {
  const { numero_pedido } = data;
  await signCertificate(numero_pedido).catch(console.error);

  return res.status(200).json({ message: "Firmado digitalmente" });
};

module.exports = { resign };
