

import mongoose from "mongoose";


const documentoLegalSchema = mongoose.Schema({
    titulo: String,
    descripcion: String,
    fecha: Date,
    tipo: String, // Por ejemplo, "contrato", "licencia", etc.
  });
  
  const DocumentoLegal = mongoose.model("DocumentoLegal", documentoLegalSchema);
  export default DocumentoLegal;
  