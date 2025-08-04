const nodemailer = require("nodemailer");

const sendEmail = (to, subject, text, res) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Tu Patrimonio ${process.env.EMAIL_USER}`,
    to,
    subject,
    html: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(200).json({
        message: `Error enviando el correo`,
        type: "error",
      });
    }
    console.log("Email sent: " + info.response);
  });
};

module.exports = { sendEmail };
