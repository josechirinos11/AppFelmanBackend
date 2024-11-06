import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"



const app = express();
app.use(express.json());  //para decirle que vamos a enviarles datos de tipo json

dotenv.config(); // busca el archivo .env para leer variables de entorno

conectarDB();

const dominiosPermitidos = process.env.FRONTEND_URL.split(",");

// Configuración de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes solo desde los dominios listados en la variable de entorno
    if (dominiosPermitidos.indexOf(origin) !== -1 || !origin) {
      callback(null, true);  // El origen está permitido
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],  // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Encabezados permitidos
};

app.use(cors(corsOptions));
//app.use(cors()); // Permitir todos los orígenes


console.log("Registrando rutas de Usuarios");
app.use("/felman/usuarios", usuarioRoutes)


const PORT = process.env.PORT || 4000;


// iniciando servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
