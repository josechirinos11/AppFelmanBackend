
import mongoose from "mongoose";


const rolSchema = mongoose.Schema({
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    permisos: [{
      type: String,  // Lista de permisos específicos
    }],
  });
  
  const Rol = mongoose.model("Rol", rolSchema);
  export default Rol;
  