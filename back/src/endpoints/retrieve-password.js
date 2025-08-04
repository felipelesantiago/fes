const {
  getUserByEmail,
  updateUserPassword,
} = require("../database/users/funcs");
const { generateNewPassword } = require("../utils/generateNewPassword");
const { sendEmail } = require("../utils/sendEmail");

const retrievePassword = async (req, res) => {
  const { to } = req.body;
  const [user] = await getUserByEmail(to);
  if (user) {
    const subject = "Tu nueva contraseña fue generada";
    const password = await generateNewPassword();
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
          .footer-text {
            margin-top: 20px;
            font-size: 14px;
            color: white;
          }
          .footer-text a {
            color: white;
            text-decoration: none;
          }
          p{
            color: white;
            font-family: 'Josefin Sans', Arial, sans-serif;
          }
      </style>
  </head>
  <body>
      <div class="container">
      <a href="https://sistemas.tupatrimon.io"><img src="https://g6t7g2j3.rocketcdn.me/wp-content/uploads/elementor/thumbs/TU-PATRIMONIO-Blanco-qlsfha3elrmd8orbqn4v945tgxgjjy62wgbqdk10cg.png" alt="Logo" style="max-width: 100%; height: auto; margin-bottom: 20px;"></a>
          <div style="font-size: 18px; margin-bottom: 10px;"><p>Hola,</p></div>
          <div style="font-size: 18px; margin-bottom: 10px;"><p>Tu nueva contraseña es:</p></div>
          <div class="password">
            <p style="margin:0"> ${password}</p>
          </div>
          <div class="footer-text">
            <p>Ingresa en <a href="https://sistemas.tupatrimon.io">sistemas.tupatrimon.io</a></p>
          </div>
      </div>
  </body>
  </html>
  `;
    await updateUserPassword(password, to);
    await sendEmail(to, subject, text, res);
    return res.status(200).json({
      message: `Correo enviado exitosamente`,
      type: "success",
    });
  } else {
    return res.status(200).json({
      message: `El usuario ${to} no existe.`,
      type: "error",
    });
  }
};

module.exports = { retrievePassword };
