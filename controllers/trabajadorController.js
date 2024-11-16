import Usuario from "../models/Usuario.js"
import Trabajador from "../models/Trabajador.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailRegistroProduccion from "../helpers/emailRegistroProduccion.js";




const agregarTrabajador = async (req, res) => {
    const { email, nombre, password, usuarioId } = req.body;
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
      const trabajadorGuardado = await trabajador.save();
  
      // Enviar el email
      emailRegistroProduccion({
        email,
        nombre,
        token: trabajadorGuardado.token,
      });
  
      res.json(trabajadorGuardado);
    } catch (error) {
      console.log(error);
    }
  
  
  }
  
const verificarConexion = (req, res) => {

  return res.json({ mensaje: "Listado de la base de datos" })


}

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
    const { nombre, password, email, identificacion, puesto, salario, telefono } = req.body;
  
    try {
      // Buscar al trabajador por ID
      const trabajador = await Trabajador.findById(id);
  
      // Verificar si el trabajador existe
      if (!trabajador) {
        return res.status(404).json({ mensaje: "Trabajador no encontrado" });
      }
  
      // Actualizar los campos enviados en la solicitud
      trabajador.nombre = nombre || trabajador.nombre;
      trabajador.email = email || trabajador.email;
      trabajador.identificacion = identificacion || trabajador.identificacion;
      trabajador.puesto = puesto || trabajador.puesto;
      trabajador.salario = salario || trabajador.salario;
      trabajador.telefono = telefono || trabajador.telefono;
  
      // Actualizar y hashear el password solo si se envía en la solicitud
      if (password) {
        const salt = await bcrypt.genSalt(10);
        trabajador.password = await bcrypt.hash(password, salt);
      }
  
      // Guardar los cambios en la base de datos
      const trabajadorActualizado = await trabajador.save();
  
      // Enviar respuesta con el trabajador actualizado
      res.json(trabajadorActualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el trabajador" });
    }
  };
  
  
  export {
  
    agregarTrabajador,
    traerTrabajadores,
    buscartrabajadorID,
    eliminarTrabajadorID,
    actualizarTrabajadorID,
    verificarConexion
  };
  