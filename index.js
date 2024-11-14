import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import trabajadorRoutes from "./routes/trabajadorRoutes.js";

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



// Registro de rutas con prefijos
app.use("/felman/usuarios", usuarioRoutes);         // Rutas de usuarios
app.use("/felman/trabajadores", trabajadorRoutes);  // Rutas de trabajadores




// Sirviendo los archivos estáticos del frontend desde la carpeta de build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "build"))); // Asegúrate de que "build" sea la carpeta correcta

// Redirigir todas las demás rutas a `index.html` para manejar la navegación en el frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});







const PORT = process.env.PORT || 4000;
// iniciando servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
