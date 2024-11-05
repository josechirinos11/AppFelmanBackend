

import mongoose from "mongoose";



const contratoClienteSchema = mongoose.Schema({
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    fechaInicio: Date,
    fechaFin: Date,
    condiciones: String,
  });
  
  const ContratoCliente = mongoose.model("ContratoCliente", contratoClienteSchema);
  export default ContratoCliente;
  