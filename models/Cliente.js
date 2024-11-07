import mongoose from "mongoose";

import generarId from "../helpers/generarId.js";



const clienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
    default: null,
  },
  direccion: {
    type: String,
    trim: true,
    default: null,
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",  // Referencia al modelo Usuario
    required: true,
  },
});

const Cliente = mongoose.model("Cliente", clienteSchema);
export default Cliente;
