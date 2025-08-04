const jwt = require("jsonwebtoken");

function generateJWT(userData) {
  const payload = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  // Opciones para el token, como el tiempo de expiración
  const options = {
    expiresIn: "1h", // Expira en 1 hora
  };

  // Genera el token
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);
  return token;
}

module.exports = { generateJWT };
