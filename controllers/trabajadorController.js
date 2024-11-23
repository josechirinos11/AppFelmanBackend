import Usuario from "../models/Usuario.js"
import Trabajador from "../models/Trabajador.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistroProduccion from "../helpers/emailRegistroProduccion.js";
import bcrypt from "bcryptjs";
import { departamentosInicialesTrabajador } from "../config/departamentosInicialesTrabajador.js";




const agregarTrabajador = async (req, res) => {
    const { email, nombre, rol, usuarioId, departamentos  } = req.body;
    console.log('agregando trabajador')
  
  
    // Prevenir usuarios duplicados
    const existeTrabajador = await Trabajador.findOne({ email });
    if (existeTrabajador) {
      const error = new Error("Trabajador ya registrado");
      return res.send('Trabajador ya registrado');
    }
  
    try {
      // Guardar un Nuevo trabajador
      const trabajador = new Trabajador(req.body);
      // Inicializar los departamentos con los valores de departamentosInicialesTrabajador
    // Verificar si vienen departamentos en el req.body
    if (departamentos && Array.isArray(departamentos)) {
      trabajador.departamentos = departamentos; // Usar los departamentos enviados en el cuerpo de la solicitud
    } else {
      trabajador.departamentos = departamentosInicialesTrabajador; // Usar los departamentos predeterminados
    }
      const trabajadorGuardado = await trabajador.save();
  
      // Enviar el email
      emailRegistroProduccion({
        email,
        nombre,
        token: trabajadorGuardado.token,
      });
  
      res.json(trabajadorGuardado);
    } catch (error) {
      console.error(error);
    res.status(500).json({ msg: "Error al crear el trabajador" });
    }
  
  
  }
  
const verificarConexion = (req, res) => {

  return res.json({ mensaje: "Listado de la base de datos" })


}

const traerCampos = async (req, res) => {
  try {
    // Verificar el tipo de usuario
    const { tipo, data } = req.usuario;

    let campos;

    // Si es un Usuario, obtenemos los campos del modelo Usuario
    if (tipo === "usuario") {
      campos = Object.keys(Usuario.schema.obj).filter(
        (campo) => !['token', '__v', '_id'].includes(campo) // Excluye los campos no necesarios
      );
    } 
    // Si es un Trabajador, obtenemos los campos del modelo Trabajador
    else if (tipo === "trabajador") {
      campos = Object.keys(Trabajador.schema.obj).filter(
        (campo) => !['token', '__v', '_id'].includes(campo) // Excluye los campos no necesarios
      );
    }

    // Si no se encontró el tipo de usuario
    if (!campos) {
      return res.status(400).json({ msg: "Tipo de usuario no válido" });
    }

    // Devuelve los campos según el tipo de usuario
    return res.json(campos);
  } catch (error) {
    console.error('Error al obtener los campos:', error);
    return res.status(500).json({ mensaje: 'Error al obtener los campos del esquema' });
  }
};


  const traerTrabajadores = async (req, res) => {
    try {
      const trabajadores = await Trabajador.find(); // Traer todos los trabajadores
      return res.json(trabajadores); // Asegúrate de retornar aquí para evitar más ejecuciones
    } catch (error) {
      console.log(error);
      return res.status(500).json({ mensaje: "Error al obtener los trabajadores" }); // Asegúrate de retornar aquí también
    }
  };
  const buscartrabajadorID = async (req, res) => {
    const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
    try {
      // Buscar el trabajador por ID
      const trabajador = await Trabajador.findById(id);
  
      // Verificar si se encontró el trabajador
      if (!trabajador) {
        return res.status(404).json({ mensaje: "Trabajador no encontrado" });
      }
  
      // Devolver el trabajador encontrado
      res.json(trabajador);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener el trabajador" });
    }
  };
  
  
  const eliminarTrabajadorID = async (req, res) => {
    const { id } = req.params; // Obtener el ID del trabajador desde los parámetros de la ruta
  
    try {
      // Buscar al trabajador por ID
      const trabajador = await Trabajador.findById(id);
  
      // Verificar si el trabajador existe
      if (!trabajador) {
        return res.status(404).json({ mensaje: "Trabajador no encontrado" });
      }
  
      // Eliminar el trabajador
      await trabajador.deleteOne();
  
      // Enviar respuesta de éxito
      res.json({ mensaje: "Trabajador eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el trabajador" });
    }
  };
  
  
  const actualizarTrabajadorID = async (req, res) => {
    const { id } = req.params; // Obtener el ID del trabajador desde los parámetros de la ruta
    const datosActualizados = req.body; // Todos los datos enviados en la solicitud
  
    try {
      // Buscar al trabajador por ID
      const trabajador = await Trabajador.findById(id);
  
      // Verificar si el trabajador existe
      if (!trabajador) {
        return res.status(404).json({ mensaje: "Trabajador no encontrado" });
      }
  
      // Iterar sobre las claves enviadas en el cuerpo de la solicitud
      Object.keys(datosActualizados).forEach((campo) => {
        // Evitar actualizar campos sensibles o no válidos
        if (campo !== "_id" && campo !== "usuarioId" && campo !== "token" && campo !== "confirmado") {
          // Manejo especial para el campo "password"
          if (campo === "password" && datosActualizados[campo].trim() !== "") {
            trabajador[campo] = datosActualizados[campo]; // El middleware `pre('save')` se encargará del hasheo
          } else if (campo !== "password") {
            trabajador[campo] = datosActualizados[campo];
          }
        }
      });
  
      // Guardar los cambios en la base de datos
      const trabajadorActualizado = await trabajador.save();
  
      // Enviar respuesta con el trabajador actualizado
      res.json(trabajadorActualizado);
    } catch (error) {
      console.error("Error al actualizar trabajador:", error);
      res.status(500).json({ mensaje: "Error al actualizar el trabajador" });
    }
  };
  
  
  export {
  
    agregarTrabajador,
    traerTrabajadores,
    buscartrabajadorID,
    eliminarTrabajadorID,
    actualizarTrabajadorID,
    verificarConexion,
    traerCampos
  };
  