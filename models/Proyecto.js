import mongoose from "mongoose";


const proyectoSchema = mongoose.Schema({
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
    fechaInicio: {
      type: Date,
      default: Date.now,
    },
    fechaFin: {
      type: Date,
    },
    tareas: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarea",
    }],
  });
  
  const Proyecto = mongoose.model("Proyecto", proyectoSchema);
  export default Proyecto;
  