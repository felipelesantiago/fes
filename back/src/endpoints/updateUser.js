const { updateUser } = require("../database/users/funcs");

const updateUserData = async (user, res) => {
  await updateUser(user);

  return res.status(200).json({
    message: `El usuario ${user.email} fue actualizado.`,
    type: "success",
  });
};

module.exports = { updateUserData };
