import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.js";
import Trabajador from "../models/Trabajador.js";


const checkAuth = async (req, res, next) => {
  
  let token;
  // en este if comprobamos que estan enviando por headers authorization el token
  // y que tambien tenga la palabra bearer
  //recuerda que por combencion lleva esa palabra primero
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // req.headers.authorization coniene el token con la palabra bearer token.......
      // .split(" ")[1];  este hace un arreglo diferenciado por el espacio
      // el 1 hace que agarremos la posicion 1 que es el token, por que la pocicion 0 es la palabra bearer
      token = req.headers.authorization.split(" ")[1];
      // verificamos el token sea el correcto y firmamos con la palabra secreta
      // devuelve el id del usuario por que eso es lo que estamos codificando en el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // aqui nos regresa de la base de datos la informacion al encontrar el ID
      // sin password token confirmado, ya que el - lo resta de la informacion extraida
      // esa informacion la guarda en una sesion en el req.usuario
          // Realizamos ambas búsquedas en paralelo

 // Buscamos el usuario en ambos modelos (Usuario y Trabajador)
 const usuario = await Usuario.findById(decoded.id);
 const trabajador = await Trabajador.findById(decoded.id);

 // Determinamos el tipo de usuario según la existencia en los modelos
 if (usuario) {
   req.usuario = { tipo: "usuario", data: usuario }; // Almacenamos como tipo usuario
 } else if (trabajador) {
   req.usuario = { tipo: "trabajador", data: trabajador }; // Almacenamos como tipo trabajador
 } else {
   throw new Error("Usuario no encontrado");
 }

 //     req.usuario = await Usuario.findById(decoded.id).select(
  //      "-password -token -confirmado"
 //     );

    
      return next();
    } catch (error) {
      const e = new Error("Token no Válido");
      return res.status(403).json({ msg: e.message });
    }
  }

  // si no existe el token o el bearer entrara a este if por que nunca se creo esta variable
  // envia el mensaje del error
  if (!token) {
    const error = new Error("Token no Válido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
