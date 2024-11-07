import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"


// creando
const app = express();
app.use(express.json());  //para decirle que vamos a enviarles datos de tipo json

dotenv.config(); // busca el archivo .env para leer variables de entorno

conectarDB();

const dominiosPermitidos = process.env.FRONTEND_URL.split(",");

// Configura CORS para permitir todos los orígenes
const corsOptions = {
  origin: '*', // Esto permitirá que cualquier origen haga solicitudes a tu backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  credentials: true,  // Si es necesario para cookies de sesión
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
