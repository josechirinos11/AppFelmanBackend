import mongoose from "mongoose";



const flotaSchema = mongoose.Schema({
    matricula: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ["camion", "furgoneta", "auto", "otro"],
      required: true,
    },
    estado: {
      type: String,
      enum: ["disponible", "en uso", "en mantenimiento"],
      default: "disponible",
    },
    ubicacion: {
      latitud: Number,
      longitud: Number,
    },
    responsableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
    },
  });
  
  const Flota = mongoose.model("Flota", flotaSchema);
  export default Flota;
  