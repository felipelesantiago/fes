const { updateUserPassword } = require("../database/users/funcs");

const updatePassword = async (req, res) => {
  const { password, email } = req.body;
  await updateUserPassword(password, email);

  res
    .status(200)
    .json({
      message: "La contraseña se actualizo correctamente.",
      type: "success",
    });
};

module.exports = { updatePassword };
