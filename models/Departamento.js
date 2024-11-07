import mongoose from "mongoose";

import generarId from "../helpers/generarId.js";

const departamentoSchema = mongoose.Schema({
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      default: null,
    },
  });
  
  const Departamento = mongoose.model("Departamento", departamentoSchema);
  export default Departamento;
  