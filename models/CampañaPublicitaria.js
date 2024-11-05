


import mongoose from "mongoose";


const campañaPublicitariaSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    fechaInicio: Date,
    fechaFin: Date,
    presupuesto: Number,
    plataforma: String, // Ej: "Google Ads", "Facebook"
  });
  
  const CampañaPublicitaria = mongoose.model("CampañaPublicitaria", campañaPublicitariaSchema);
  export default CampañaPublicitaria;
  