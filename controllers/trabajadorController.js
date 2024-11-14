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
  
  const traerTrabajadores = async (req, res) => {
    try {
      const trabajadores = await Trabajador.find(); // Traer todos los trabajadores
      res.json(trabajadores);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al obtener los trabajadores" });
    }
  };
  
  
  export {
  
    agregarTrabajador,
    traerTrabajadores
  };
  