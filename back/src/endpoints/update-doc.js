const { getDocById, updateDoc } = require("../database/docs/funcs");
const { verificarYCrearCarpeta } = require("../utils/verificarCarpeta");

const updateDocData = async (data, res) => {
  const { numero_pedido, cantidad_firmantes, firmados, object, repertorio } =
    data;
  const [doc] = await getDocById(numero_pedido);
  if (object) {
    await verificarYCrearCarpeta(numero_pedido, object);
  }
  await updateDoc(
    numero_pedido,
    cantidad_firmantes || doc.total,
    firmados || doc.count,
    repertorio
  );

  return res.status(200).json({
    message: `El archivo con id ${numero_pedido} fue actualizado correctamente. Este archivo ya posee ${
      doc.count
    } ${doc.count > 1 ? "firma" : "firmas"}.`,
    type: "success",
  });
};

module.exports = { updateDocData };
