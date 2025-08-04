const { getUserByEmail } = require("../database/users/funcs");
const { decodeJWT } = require("../utils/decodeJwt");

const getUser = async (req, res) => {
  const { email } = decodeJWT(req, res);
  const results = await getUserByEmail(email);
  return res.status(200).json(results[0]);
};
module.exports = { getUser };
