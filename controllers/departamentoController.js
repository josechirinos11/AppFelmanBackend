import Usuario from "../models/Usuario.js"
import Departamento from "../models/Departamento.js"
import Trabajador from "../models/Trabajador.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistroProduccion from "../helpers/emailRegistroProduccion.js";
import bcrypt from "bcryptjs";
import { departamentosInicialesTrabajador } from "../config/departamentosInicialesTrabajador.js";


const buscarDepartamentos = async (req, res) => {
    // Verificar el tipo de usuario

    console.log("ruta departamentos/items");
    if (req.usuario.tipo === "usuario") {
  
      try {
         // Buscamos todos los trabajadores que tengan el mismo usuarioId que el usuario actual
         const data = await Usuario.find({ usuarioId: req.usuario.data._id });
         console.log("en buscar departamento...........: ", data);
        return res.json(data); // Asegúrate de retornar aquí para evitar más ejecuciones
      } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: "Error al obtener los departamentos" });
      }
    } else if (req.usuario.tipo === "trabajador") {
  
      try {
        // Si el tipo de usuario es 'trabajador', buscamos el trabajador con el usuarioId
        const data = await Trabajador.find({usuarioId: req.usuario.data.usuarioId});
       
        if (!data) {
          return res.status(404).json({ mensaje: "departamentos no encontrado" });
        }
        console.log("en buscar departamento...........: ", data);
        return res.json(data); // Retornamos el trabajador encontrado
      } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: "Error al obtener los departamento" });
      }
    } else {
      return res.status(400).json({ mensaje: "Tipo de usuario no válido" });
    }
  };





export {
  
    buscarDepartamentos
  };


