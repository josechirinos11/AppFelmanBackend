



import mongoose from "mongoose";



const estandarCalidadSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    fechaImplementacion: Date,
  });
  
  const EstandarCalidad = mongoose.model("EstandarCalidad", estandarCalidadSchema);
  export default EstandarCalidad;
  