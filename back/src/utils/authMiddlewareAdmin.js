// authMiddleware.js
const { getUserByEmail } = require("../database/users/funcs");
const { decodeJWT } = require("./decodeJwt");

const authenticateUserAsAdmin = async (req, res, next) => {
  const { email } = decodeJWT(req, res);
  try {
    const [user] = await getUserByEmail(email);
    if (!user || !user.enabled || user.rol !== "Admin") {
      return res.status(403).json({
        message: "Solo Admins pueden realizar esta accion",
        type: "failed",
      });
    }
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({
      message: "Solo Admins pueden realizar esta accion",
      type: "failed",
    });
  }
};

module.exports = authenticateUserAsAdmin;
