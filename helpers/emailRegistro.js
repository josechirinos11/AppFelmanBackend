import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    //secure: false,  // Cambia a `true` si usas el puerto 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;
console.log('email del usuario: ', email)
  //Enviar el email

  const info = await transporter.sendMail({
    from: '"Felman App" <no-reply@felmanapp.com>',
    to: email,
    subject: "Comprueba tu cuenta en Felman",
    text: "Comprueba tu cuenta en Felman",
    html: `<p>Hola: ${nombre}, comprueba tu cuenta en Felman.</p>
        <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.VITE_BACKEND_URL}/felman/usuarios/confirmar/${token}">Comprobar Cuenta</a> </p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;
