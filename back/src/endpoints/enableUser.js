const { updateUserAccess } = require("../database/users/funcs");

const enableUser = async (data, res) => {
  const { id } = data;
  await updateUserAccess(true, id);
  return res
    .status(200)
    .json({ message: "Usuario Activado.", type: "success" });
};

module.exports = { enableUser };
