const nodemailer = require("nodemailer");

async function main(message) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "", // Aqui va el email
      pass: "", // la password de contraseñas de aplicacion
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Only needed if you don't have a real mail account for testing
  /*  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  }); */

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "<>", //quien envía el email
    to: "serniorityweb@gmail.com", // receptor del email
    subject: "", // Concepto/título
    /* text: "Hola world, primera prueba de un email", */
    html: "<p>HTML version of the message</p>", // cuerpo del escrito. Usar "text" de arriba para algo sencillo.
  });
}

module.exports = { main };
