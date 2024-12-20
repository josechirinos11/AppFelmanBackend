import Usuario from "../models/Usuario.js"
import Trabajador from "../models/Trabajador.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistroProduccion from "../helpers/emailRegistroProduccion.js";
import { departamentosInicialesUsuario } from "../config/departamentosInicialesUsuario.js";


const registrar = async (req, res) => {

  const { email, nombre } = req.body;

  console.log(email)
  console.log(nombre)

  // Prevenir usuarios duplicados
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.send('agregando trabajador');
  }

  try {
    // Guardar un Nuevo Usuario
    const usuario = new Usuario(req.body);
    // Inicializar los departamentos con los valores de departamentosInicialesUsuario
    usuario.departamentos = departamentosInicialesUsuario; // << Línea agregada
    usuario.rol = "Administrador"
    const usuarioGuardado = await usuario.save();

    // Enviar el email
    emailRegistroProduccion({
      email,
      nombre,
      token: usuarioGuardado.token,
    });

    res.json(usuarioGuardado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear el usuario" });
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


  try {
    // Realizamos ambas búsquedas en paralelo
    const [usuario, trabajador] = await Promise.all([
      Usuario.findOne({ email }),
      Trabajador.findOne({ email })
    ]);

    // Verificamos si se encontró en alguna de las dos colecciones
    if (usuario) {
      // Comprobar si el usuario esta confirmado
      if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada, revisa tu correo");
        return res.status(403).json({ msg: error.message });
      }
      //comprobar passwor del usuario
      if (await usuario.comprobarPassword(password)) {
        // Autenticar
        //genero el token
        const token = generarJWT(usuario.id)
        console.log("el token del usuario es:   ", token)
        res.json({
          _id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          departamentos: usuario.departamentos,
          rol: usuario.rol,
          token,
        });
      } else {
        const error = new Error("El Password es incorrecto");
        return res.status(403).json({ msg: error.message });
      }
    } else if (trabajador) {
      // Comprobar si el usuario esta confirmado
      if (!trabajador.confirmado) {
        const error = new Error("Tu Cuenta no ha sido confirmada, revisa tu correo");
        return res.status(403).json({ msg: error.message });
      }
      //comprobar passwor del Trabajador
      if (await trabajador.comprobarPassword(password)) {
        // Autenticar
        //genero el token
        const token = generarJWT(trabajador.id)
        console.log("el token del trabajador es:   ", token)
        res.json({
          _id: trabajador._id,
          nombre: trabajador.nombre,
          email: trabajador.email,
          departamentos: trabajador.departamentos,
          rol: trabajador.rol,
          token,
          usuarioId: trabajador.usuarioId
        });
      } else {
        const error = new Error("El Password es incorrecto");
        return res.status(403).json({ msg: error.message });
      }
    } else {
      const error = new Error("No existe registros de esa informacion, Verifique!");
      return res.status(404).json({ msg: error.message });
    }
  } catch (error) {
    console.error('Error al buscar el email:', error);
    throw new Error('Error en la búsqueda');
  }



};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Buscar el usuario por correo
  const existeUsuario = await Usuario.findOne({ email });

  // Verificar si el usuario existe
  if (!existeUsuario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    // Generar un nuevo token y guardarlo en el usuario
    existeUsuario.token = generarId();
    await existeUsuario.save();

    // Enviar email con instrucciones
    await emailOlvidePassword({
      email,
      nombre: existeUsuario.nombre,
      token: existeUsuario.token,
    });

    // Responder con un mensaje de éxito
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ msg: "Hubo un error al procesar la solicitud" });
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

const buscarUsuarioID = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
  try {
    // Buscar el usuario por ID
    const usuario = await Usuario.findById(id);

    // Verificar si se encontró el usuario
    if (usuario) {
      return res.json(usuario);  // Si se encuentra, devolver el usuario
    }

    // Si no se encuentra el usuario, buscar el trabajador
    const trabajador = await Trabajador.findById(id);

    // Verificar si se encontró el trabajador
    if (trabajador) {
      return res.json(trabajador);  // Si se encuentra, devolver el trabajador
    }

    // Si ni el usuario ni el trabajador fueron encontrados
    return res.status(404).json({ mensaje: "Usuario o Trabajador no encontrado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener el usuario o trabajador" });
  }
};


const actualizarUsuario = async (req, res) => {
  const { id } = req.params; // Obtener el ID del trabajador o usuario desde los parámetros de la ruta
  const datosActualizados = req.body; // Todos los datos enviados en la solicitud

  try {
    // Buscar primero en el modelo Usuario
    let recurso = await Usuario.findById(id);

    if (!recurso) {
      // Si no se encuentra en Usuario, buscar en Trabajador
      recurso = await Trabajador.findById(id);
      if (!recurso) {
        return res.status(404).json({ mensaje: "Usuario o Trabajador no encontrado" });
      }
    }

    // Iterar sobre las claves enviadas en el cuerpo de la solicitud
    Object.keys(datosActualizados).forEach((campo) => {
      // Evitar actualizar campos sensibles o no válidos
      if (
        campo !== "_id" &&
        campo !== "usuarioId" &&
        campo !== "token" &&
        campo !== "confirmado" &&
        campo !== "departamentos"
      ) {
        // Manejo especial para el campo "password"
        if (campo === "password" && datosActualizados[campo]?.trim() !== "") {
          recurso[campo] = datosActualizados[campo]; // El middleware `pre('save')` se encargará del hasheo
        } else if (campo !== "password") {
          recurso[campo] = datosActualizados[campo];
        }
      }
    });

    // Guardar los cambios en la base de datos
    const recursoActualizado = await recurso.save();

    // Enviar respuesta con el recurso actualizado
    res.json(recursoActualizado);
  } catch (error) {
    console.error("Error al actualizar el recurso:", error);
    res.status(500).json({ mensaje: "Error al actualizar el recurso" });
  }
};


const actualizarDepartamentosUsuario = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
  const datosActualizados = req.body; // Los departamentos a actualizar

  try {
    // Validar que los datosActualizados son un arreglo de departamentos
    if (!Array.isArray(datosActualizados)) {
      return res.status(400).json({ mensaje: "Los departamentos deben ser un arreglo." });
    }

    // Primero intentar encontrar al usuario en la colección de Usuarios
    let usuario = await Usuario.findById(id);

    if (usuario) {
      // Si el usuario es encontrado, actualizamos el campo de departamentos en el modelo Usuario
      usuario.departamentos = datosActualizados;

      // Guardar los cambios en la base de datos
      const usuarioActualizado = await usuario.save();

      // Enviar respuesta con el usuario actualizado
      return res.json(usuarioActualizado);
    }

    // Si no se encuentra en Usuario, intentamos encontrarlo en la colección de Trabajadores
    let trabajador = await Trabajador.findById(id);

    if (trabajador) {
      // Si el trabajador es encontrado, actualizamos el campo de departamentos en el modelo Trabajador
      trabajador.departamentos = datosActualizados;

      // Guardar los cambios en la base de datos
      const trabajadorActualizado = await trabajador.save();

      // Enviar respuesta con el trabajador actualizado
      return res.json(trabajadorActualizado);
    }

    // Si no se encuentra ni en Usuario ni en Trabajador
    return res.status(404).json({ mensaje: "Usuario o trabajador no encontrado." });

  } catch (error) {
    console.error("Error al actualizar trabajador:", error);
    return res.status(500).json({ mensaje: "Error al actualizar el trabajador o usuario." });
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
  buscarUsuarioID,
  actualizarUsuario,
  actualizarDepartamentosUsuario
};
