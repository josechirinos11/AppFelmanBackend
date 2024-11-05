

import mongoose from "mongoose";


const movimientoCajaSchema = mongoose.Schema({
    fecha: {
      type: Date,
      default: Date.now,
    },
    monto: Number,
    tipo: {
      type: String,
      enum: ["ingreso", "egreso"],
    },
    descripcion: String,
  });
  
  const MovimientoCaja = mongoose.model("MovimientoCaja", movimientoCajaSchema);
  export default MovimientoCaja;
  