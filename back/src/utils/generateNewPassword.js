const securePassword = require("secure-random-password");

const generateNewPassword = () => {
  const password = securePassword.randomPassword({
    length: 16, // longitud de la contraseña
    characters: [
      securePassword.lower,
      securePassword.upper,
      securePassword.digits,
      securePassword.symbols,
    ],
  });

  return password;
};

module.exports = { generateNewPassword };
