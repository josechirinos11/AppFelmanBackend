import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import generarId from "../helpers/generarId.js";



const trabajadorSchema = mongoose.Schema({
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
  identificacion: {
    type: String,
   
    trim: true,
    default: null,
  },
  puesto: {
    type: String,
    trim: true,
    default: null,
  },
  salario: {
    type: Number,
    default: null,
  },
  telefono: {
    type: String,
    trim: true,
    default: null,
  },
  token: {
    type: String,
    default: generarId(),// esta funcio se llama para generar un id unico, esta funcion esta en los helpers
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});


//aqui en adelante hasheamos el password
// el pre es un midleware que quiere decir antes de almacenarlo
trabajadorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) { // este if verifica si un password ya fue hasheado next no lo hashees
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// .methods hace realizar una funcion solamente en este schema
// esa funcion recibe el password del formulario del frontend y lo compara con el de la base de datos
trabajadorSchema.methods.comprobarPassword = async function ( passwordFormulario ) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

const Trabajador = mongoose.model("Trabajador", trabajadorSchema);
export default Trabajador;
