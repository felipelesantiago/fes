const { hashPassword } = require("../../utils/hasPassword");
const { openConnection } = require("../../utils/mysql");

async function getUsers() {
  console.log("getUsers");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT users.id, users.enabled, users.email, roles.nombre AS rol FROM users INNER JOIN roles ON users.rolId = roles.id",
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta getUserByEmail:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function getUserByEmail(email) {
  console.log("getUserByEmail");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT users.id, users.password, users.enabled, users.email, roles.nombre AS rol FROM users INNER JOIN roles ON users.rolId = roles.id WHERE email = ?",
      [email],
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta getUserByEmail:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function updateUserAccess(value, id) {
  console.log("updateUserAccess");
  const connection = await openConnection();
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET enabled = ? WHERE id = ?",
      [value, id],
      (error, results, fields) => {
        if (error) {
          console.error(
            "Error al realizar la consulta updateUserAccess:",
            error
          );
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function updateUserPassword(value, email) {
  console.log("updateUserPassword");
  const connection = await openConnection();
  const hashedPassword = await hashPassword(value);
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email],
      (error, results, fields) => {
        if (error) {
          console.error(
            "Error al realizar la consulta updateUserAccess:",
            error
          );
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function updateUser(user) {
  console.log("updateUser");
  const connection = await openConnection();
  const hashedPassword = await hashPassword(user.password);
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE users SET email = ?, rolId = ?, password = ? WHERE id = ?",
      [user.email, user.rolId, hashedPassword, user.id],
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta updateUser:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

async function addUser(user) {
  console.log("addUser");
  const connection = await openConnection();
  console.log(user.password);
  const hashedPassword = await hashPassword(user.password);

  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO users (email, rolId, password) VALUES (?,?,?)",
      [user.email, user.rolId, hashedPassword],
      (error, results, fields) => {
        if (error) {
          console.error("Error al realizar la consulta addUser:", error);
          reject(error);
        }
        resolve(results);
      }
    );
  });
}

module.exports = {
  getUsers,
  getUserByEmail,
  updateUserAccess,
  updateUser,
  addUser,
  updateUserPassword,
};
