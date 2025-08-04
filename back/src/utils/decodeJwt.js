const jwt = require("jsonwebtoken");

const decodeJWT = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401);
  }
  // Decodificar el token sin verificar la firma ya que es de Google
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.email) {
    return res.status(403);
  }

  return decoded;
};

module.exports = { decodeJWT };
