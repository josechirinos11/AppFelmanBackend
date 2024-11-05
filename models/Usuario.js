import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    default: null,
    trim: true,
  },
  rol: {
    type: String,
    enum: ["admin", "empleado"],  // Puedes añadir más roles según sea necesario
    required: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarId(),// esta funcio se llama para generar un id unico, esta funcion esta en los helpers
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

//aqui en adelante hasheamos el password
// el pre es un midleware que quiere decir antes de almacenarlo
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) { // este if verifica si un password ya fue hasheado next no lo hashees
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// .methods hace realizar una funcion solamente en este schema
// esa funcion recibe el password del formulario del frontend y lo compara con el de la base de datos
usuarioSchema.methods.comprobarPassword = async function ( passwordFormulario ) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
