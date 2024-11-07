import nodemailer from 'nodemailer';

const emailRegistroGmail = async (datos) => {
  const { email, nombre, token } = datos;

  // Crear un transportador con nodemailer usando Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',  // Usamos Gmail como servicio
    auth: {
      user: process.env.GMAIL_USER,  // Correo de Gmail
      pass: process.env.GMAIL_PASS,  // Contraseña de Gmail
    },
  });

  const info = await transporter.sendMail({
    from: 'No-Reply@Felman.com',  // Correo de envío
    to: email,  // Correo destinatario
    subject: 'Comprueba tu cuenta en Felman',
    text: 'Comprueba tu cuenta en Felman',
    html: `
      <p>Hola: ${nombre}, comprueba tu cuenta en Felman.</p>
      <p>Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace:</p>
      <a href="${process.env.VITE_BACKEND_URL}/felman/usuarios/confirmar/${token}">Comprobar Cuenta</a>
      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
    `,
  });

  console.log('Correo enviado: %s', info.messageId);
};

export default emailRegistroGmail;
