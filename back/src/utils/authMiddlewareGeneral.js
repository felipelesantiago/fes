// authMiddleware.js
const { getUserByEmail } = require("../database/users/funcs");
const { decodeJWT } = require("./decodeJwt");

const authenticateToken = async (req, res, next) => {
  const { email } = decodeJWT(req, res);
  try {
    const user = await getUserByEmail(email);

    if (user.length === 0 || !user[0].enabled) {
      return res.sendStatus(403);
    }
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
};

module.exports = authenticateToken;
