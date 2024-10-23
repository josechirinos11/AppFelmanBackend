import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"



const app = express();
app.use(express.json());  //para decirle que vamos a enviarles datos de tipo json

dotenv.config(); // busca el archivo .env para leer variables de entorno

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      // El Origen del Request esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

//app.use(cors(corsOptions));


console.log("Registrando rutas de Usuarios");
app.use("/felman/usuarios", usuarioRoutes)


const PORT = process.env.PORT || 4000;


// iniciando servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
