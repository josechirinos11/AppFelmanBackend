import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"
import trabajadorRoutes from "./routes/trabajadorRoutes.js";
import administradorRoutes from "./routes/administradorRoutes.js"
import departamentoRoutes from "./routes/departamentoRoutes.js"




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
app.use("/felman/Administrador", administradorRoutes)
app.use("/felman/usuarios", usuarioRoutes);         // Rutas de usuarios
app.use("/felman/trabajadores", trabajadorRoutes);  // Rutas de trabajadores
app.use("/felman/departamentos", departamentoRoutes);  // Rutas de trabajadores




//usando SSE
app.get("/events", (req, res) => {
  // Establecer las cabeceras para una conexión SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Enviar las cabeceras inmediatamente

  // Enviar datos cada 5 segundos
  const interval = setInterval(() => {
    const data = {
      message: "Actualización en tiempo real",
      timestamp: new Date().toISOString(),
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000); // Cada 5 segundos

  // Limpiar el intervalo cuando el cliente se desconecta
  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});








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
