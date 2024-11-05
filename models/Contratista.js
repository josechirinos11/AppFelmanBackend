


import mongoose from "mongoose";
const contratistaSchema = mongoose.Schema({
    nombre: String,
    email: String,
    telefono: String,
    rol: String, // Rol del contratista o consultor
    fechaInicio: Date,
    fechaFin: Date,
  });
  
  const Contratista = mongoose.model("Contratista", contratistaSchema);
  export default Contratista;
  