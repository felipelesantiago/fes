const bcrypt = require("bcrypt");

// Función para hash de contraseña
async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Función para verificar la contraseña
async function checkPassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

module.exports = { hashPassword, checkPassword };
