import mongoose from "mongoose";

import generarId from "../helpers/generarId.js";


const pedidoSchema = mongoose.Schema({
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",  // Hace referencia al cliente que realiza el pedido
      required: false, // Permitimos que sea nulo si el pedido es de un proveedor
    },
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proveedor",  // Hace referencia al proveedor para pedidos de compra
      required: false, // Permitimos que sea nulo si el pedido es de un cliente
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    montoTotal: {
      type: Number,
      required: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "completado", "cancelado"],  // Estados posibles del pedido
      default: "pendiente",
    },
    detalles: [{
      descripcion: String,
      cantidad: Number,
      precioUnitario: Number,
    }],
  });
  
  const Pedido = mongoose.model("Pedido", pedidoSchema);
  export default Pedido;
  