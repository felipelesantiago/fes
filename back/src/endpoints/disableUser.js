const { updateUserAccess } = require("../database/users/funcs");

const disableUser = async (data, res) => {
  const { id } = data;
  await updateUserAccess(false, id);
  return res
    .status(200)
    .json({ message: "Usuario Desactivado.", type: "success" });
};

module.exports = { disableUser };
