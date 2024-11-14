// backend
// Instala las dependencias necesarias:   npm install express dotenv



// Crea un archivo server.js para configurar el servidor SSE:

import express from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js"; // Suponiendo que tienes una conexión a la base de datos

const app = express();
app.use(express.json());
dotenv.config();
conectarDB();

// Endpoint SSE
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Simulamos que se envían cambios cada 5 segundos
  setInterval(() => {
    res.write(`data: ${JSON.stringify({ message: "Nuevo cambio en la base de datos" })}\n\n`);
  }, 5000);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});



// Frontend (React)
// En el frontend, puedes suscribirte a los eventos enviados por el servidor.

// Usa el EventSource en tu componente React:

import { useEffect } from "react";

const RealTimeUpdates = () => {
  useEffect(() => {
    const eventSource = new EventSource('https://tu-servidor.com/events');

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Evento recibido:", data);
      // Aquí puedes actualizar el estado de la aplicación o hacer algo con los datos
    };

    eventSource.onerror = function (error) {
      console.log("Error en SSE:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return <div>Esperando actualizaciones en tiempo real...</div>;
};

export default RealTimeUpdates;





  // useEffect para consultar la base de datos al cargar el componente o cambiar "informacion"
  useEffect(() => {
    
    const fetchData = async () => {
      if (informacion === "Empleados") {
        try {
          const response = await clienteAxios.get('/trabajadores/recursos-humanos'); // Ruta para traer la colección trabajadores
          setData(response.data);            // Guardamos los datos en el estado
          setFilteredData(response.data);    // Inicializamos el filtro con todos los datos
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      }
    };
    fetchData();
  }, [informacion]);
  
