
import mongoose from "mongoose";


const mantenimientoSchema = mongoose.Schema({
    equipoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventario",  // Relaciona con el modelo Inventario para cada equipo
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    tipo: {
      type: String,
      enum: ["preventivo", "correctivo"],
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    responsableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
    },
  });
  
  const MantenimientoEquipo = mongoose.model("MantenimientoEquipo", mantenimientoSchema);
  export default MantenimientoEquipo;
  