

import mongoose from "mongoose";


const sistemaSchema = mongoose.Schema({
    nombre: String,
    proveedor: String,
    version: String,
    estado: {
      type: String,
      enum: ["activo", "inactivo", "mantenimiento"],
      default: "activo",
    },
  });
  
  const Sistema = mongoose.model("Sistema", sistemaSchema);
  export default Sistema;
  
