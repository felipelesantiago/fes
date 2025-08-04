const { getUsers } = require("../database/users/funcs");

const getAllUsers = async (res) => {
  const results = await getUsers();
  return res.status(200).json(results);
};
module.exports = { getAllUsers };
