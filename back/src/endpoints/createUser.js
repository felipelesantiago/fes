const { addUser, getUserByEmail } = require("../database/users/funcs");
const { generateNewPassword } = require("../utils/generateNewPassword");
const { sendEmail } = require("../utils/sendEmail");

const createUser = async (user, res) => {
  const password = await generateNewPassword();
  user.password = password;
  const [validateUser] = await getUserByEmail(user.email);
  if (!!validateUser) {
    return res.status(200).json({
      message: `El usuario ${user.email} ya existe.`,
      type: "error",
    });
  }
  await addUser(user);
  const subject = "Haz sido invitado a Tu Patrimonio!";
  const text = `<!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Contraseña</title>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet">
      <style>
          body {
            font-family: 'Josefin Sans', Arial, sans-serif;
              color: #333;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              color: #fff;
          }
          .container {
              background-color: #0A0118;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 400px;
              width: 100%;
              color: #fff;
          }
          .password {
              font-size: 24px;
              font-weight: bold;
              background-color: #0A0118;
              padding: 10px;
              color: #fff;
              border-radius: 4px;
              display: inline-block;
          }
          p{
            color: white;
            font-family: 'Josefin Sans', Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <img src="https://g6t7g2j3.rocketcdn.me/wp-content/uploads/elementor/thumbs/TU-PATRIMONIO-Blanco-qlsfha3elrmd8orbqn4v945tgxgjjy62wgbqdk10cg.png" alt="Logo" style="max-width: 100%; height: auto; margin-bottom: 20px;">
          <div style="font-size: 18px; margin-bottom: 10px;"><p>Bienvenido a Tu Patrimonio,</p></div>
          <div style="font-size: 18px; margin-bottom: 10px;"><p>Puedes ingresar con Google o con la siguiente contraseña:</p></div>
          <div class="password">
          <p style="margin:0"> ${password}</p>
          </div>
      </div>
  </body>
  </html>
  `;
  await sendEmail(user.email, subject, text, res);

  return res.status(200).json({
    message: `El usuario ${user.email} fue creado.`,
    type: "success",
  });
};

module.exports = { createUser };
