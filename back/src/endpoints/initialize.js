const { insertDoc, getDocById, updateDoc } = require("../database/docs/funcs");
const { verificarYCrearCarpeta } = require("../utils/verificarCarpeta");
const fs = require("fs");

const initialize = async (data, res) => {
  const { numero_pedido, cantidad_firmantes, firmados, repertorio, object } =
    data;
  const [doc] = await getDocById(numero_pedido);

  const docExists = doc?.docId;
  if (object) {
    await verificarYCrearCarpeta(numero_pedido, object);
  }

  if (!docExists) {
    await insertDoc(numero_pedido, cantidad_firmantes, firmados, repertorio);
  } else {
    await updateDoc(numero_pedido, cantidad_firmantes, firmados, repertorio);
    return res.status(200).json({
      message: `El archivo con id ${numero_pedido} fue modificado exitosamente.`,
      type: "success",
    });
  }
  return res.status(200).json({
    message: `El archivo con id ${numero_pedido} fue agregado exitosamente.`,
    type: "success",
  });
};

module.exports = { initialize };
