import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    default: false, // Por defecto, los items están desactivados
  },
});

const departamentoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  items: {
    type: [itemSchema], // Lista de items con su estado `active`
    required: true,
  },
  usuarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // Relación con usuarios
    },
  ],
});

const Departamento = mongoose.model("Departamento", departamentoSchema);
export default Departamento;
