import mongoose from "mongoose";

const inventarioSchema = mongoose.Schema({
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
  cantidad: {
    type: Number,
    required: true,
    default: 0,
  },
  coordenadas: {
    estante: { type: String, required: true },  // Identificador del estante
    nivel: { type: Number, required: true },    // Nivel del estante
    posicion: { type: Number, required: true }, // Posición en el nivel
  },
  estado: {
    type: String,
    enum: ["disponible", "reservado", "agotado"],
    default: "disponible",
  },
});

const Inventario = mongoose.model("Inventario", inventarioSchema);
export default Inventario;
