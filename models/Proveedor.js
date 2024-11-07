import mongoose from "mongoose";

import generarId from "../helpers/generarId.js";



const proveedorSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    trim: true,
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

const Proveedor = mongoose.model("Proveedor", proveedorSchema);
export default Proveedor;
