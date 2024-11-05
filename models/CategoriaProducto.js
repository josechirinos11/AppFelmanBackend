

import mongoose from "mongoose";


const categoriaProductoSchema = mongoose.Schema({
    nombre: {
      type: String,
      required: true,
    },
    descripcion: String,
  });
  
  const CategoriaProducto = mongoose.model("CategoriaProducto", categoriaProductoSchema);
  export default CategoriaProducto;
  