

import mongoose from "mongoose";


const prospectoSchema = mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    estado: {
      type: String,
      enum: ["nuevo", "contactado", "negociando", "cerrado"],
      default: "nuevo",
    },
  });
  
  const Prospecto = mongoose.model("Prospecto", prospectoSchema);
  export default Prospecto;
  