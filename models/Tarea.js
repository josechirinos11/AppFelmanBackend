import mongoose from "mongoose";



const tareaSchema = mongoose.Schema({
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      enum: ["pendiente", "en progreso", "completada"],
      default: "pendiente",
    },
    fechaLimite: {
      type: Date,
    },
    proyectoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
    },
  });
  
  const Tarea = mongoose.model("Tarea", tareaSchema);
  export default Tarea;
  