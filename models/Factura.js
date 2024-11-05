

import mongoose from "mongoose";

const facturaSchema = mongoose.Schema({
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    fecha: Date,
    monto: Number,
    estado: {
      type: String,
      enum: ["pendiente", "pagada", "vencida"],
      default: "pendiente",
    },
  });
  
  const Factura = mongoose.model("Factura", facturaSchema);
  export default Factura;
  