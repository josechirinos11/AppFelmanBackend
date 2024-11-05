import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";



const trabajadorSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  puesto: {
    type: String,
    trim: true,
    default: null,
  },
  salario: {
    type: Number,
    default: null,
  },
  telefono: {
    type: String,
    trim: true,
    default: null,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const Trabajador = mongoose.model("Trabajador", trabajadorSchema);
export default Trabajador;
