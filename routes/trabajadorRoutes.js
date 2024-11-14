import express from "express";
const router = express.Router();
import checkAuth from "../middleware/authMiddleware.js";

import {
  agregarTrabajador,
  traerTrabajadores
  } from "../controllers/trabajadorController.js";


  // Rutas protegidas con checkAuth
router.route("/recursos-humanos/")
.post(checkAuth, agregarTrabajador)  // Ruta POST para agregar trabajador, protegida con checkAuth
.get(checkAuth, traerTrabajadores);  // Ruta GET para traer trabajadores, protegida con checkAuth



export default router;
