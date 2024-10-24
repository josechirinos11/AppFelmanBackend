import Usuario from "../models/Usuario.js"
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


  
  const registrar = async (req, res) => {
   
    const { email, nombre } = req.body;

    console.log(email)
    console.log(nombre)
  
    // Prevenir usuarios duplicados
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      const error = new Error("Usuario ya registrado");
      return res.status(400).json({ msg: error.message });
    }
  
    try {
      // Guardar un Nuevo Usuario
      const usuario = new Usuario(req.body);
      const usuarioGuardado = await usuario.save();
  
      // Enviar el email
      emailRegistro({
        email,
        nombre,
        token: usuarioGuardado.token,
      });
  
      res.json(usuarioGuardado);
    } catch (error) {
      console.log(error);
    }
  }


const perfil = (req, res) => {
   
  const { usuario } = req;
  res.json(usuario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  console.log(token)

  const usuarioConfirmar = await Usuario.findOne({ token });

  if (!usuarioConfirmar) {
    console.log("token no valido")
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  // Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message });
  }
  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu Cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  
  // Revisar el password
  // en el modelo Usuario ya esta esa funcion comprobarPassword
  // y le enviamos el password, asi dentro del modelo compara la password del formulario y database
  if (await usuario.comprobarPassword(password)) {
    // Autenticar
    //genero el token
    const token = generarJWT(usuario.id)
    console.log("el token del usuario es:   ", token)
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token,
    });
  } else {
    const error = new Error("El Password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeUsuario = await Usuario.findOne({ email });
  if (!existeUsuario) {
    const error = new Error("El Usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeUsuario.token = generarId();
    await existeUsuario.save();

    // Enviar Email con instrucciones
    emailOlvidePassword({
      email,
      nombre: existeUsuario.nombre,
      token: existeUsuario.token,
    });

    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  // se lee el token enviado por la url
  const { token } = req.params;
 // se busca ese token en la base de datos
  const tokenValido = await Usuario.findOne({ token });

  if (tokenValido) {
    // El TOken es válido el usuario existe
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  // se lee el token desde la url
  const { token } = req.params;
  // se optiene el password nueva del formulario
  const { password } = req.body;

  // verificamos de que es el usuario con sesion abierta
  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // guardamos password nueva y null al token
    usuario.token = null;
    usuario.password = password;
    await usuario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body;
  if (usuario.email !== req.body.email) {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      const error = new Error("Ese email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.web = req.body.web;
    usuario.telefono = req.body.telefono;

    const usuarioActualizado = await usuario.save();
    res.json(usuarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { id } = req.usuario;
  const { pwd_actual, pwd_nuevo } = req.body;

  // Comprobar que el usuario existe
  const usuario = await Usuario.findById(id);
  if (!usuario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  // Comprobar su password
  if (await usuario.comprobarPassword(pwd_actual)) {
    // Almacenar el nuevo password

    usuario.password = pwd_nuevo;
    await usuario.save();
    res.json({ msg: "Password Almacenado Correctamente" });
  } else {
    const error = new Error("El Password Actual es Incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  
    registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
