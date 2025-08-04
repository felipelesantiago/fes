const { getUserByEmail } = require("../database/users/funcs");
const jwt = require("jsonwebtoken");
const { decodeJWT } = require("../utils/decodeJwt");
const { checkPassword } = require("../utils/hasPassword");
const { generateJWT } = require("../utils/generateJWT");

const validateUser = async (req, res) => {
  const { email } = decodeJWT(req, res);

  const user = await getUserByEmail(email);

  return res.status(200).json(!!(user.length > 0 && user[0].enabled));
};

const validateUserByCredentials = async (req, res) => {
  const { email, password } = req.body;

  const [user] = await getUserByEmail(email);
  let checkedPassword;
  if (!!user) {
    checkedPassword = await checkPassword(password, user.password);
    if (checkedPassword) {
      if (user.enabled) {
        return res.status(200).json({
          isValid: user.enabled,
          jwt: await generateJWT(user),
          user: user,
        });
      } else {
        return res.status(200).json({
          isValid: false,
          reason: "Disabled",
        });
      }
    } else {
      return res.status(200).json({
        isValid: false,
        reason: "CredentialsSignin",
      });
    }
  }
  return res.status(200).json({
    isValid: false,
    reason: "NotExist",
  });
};

module.exports = { validateUser, validateUserByCredentials };
