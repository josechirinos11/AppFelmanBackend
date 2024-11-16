import express from "express";
const router = express.Router();
import checkAuth from "../middleware/authMiddleware.js";

import {
  agregarTrabajador,
  traerTrabajadores,
  buscartrabajadorID,
  eliminarTrabajadorID,
  actualizarTrabajadorID,
  verificarConexion
  } from "../controllers/trabajadorController.js";


  // Rutas protegidas con checkAuth
router.route("/recursos-humanos/")
.post(checkAuth, agregarTrabajador)  // Ruta POST para agregar trabajador, protegida con checkAuth
.get(checkAuth, traerTrabajadores);  // Ruta GET para traer trabajadores, protegida con checkAuth

router.route("/recursos-humanos/:id")
  .get(checkAuth, buscartrabajadorID)        // Usar GET para buscar un trabajador por ID
  .delete(checkAuth, eliminarTrabajadorID)   // Usar DELETE para eliminar un trabajador por ID
  .put(checkAuth, actualizarTrabajadorID);   // Usar PUT para actualizar un trabajador por ID

  router.route("/departamentos/").get(checkAuth, verificarConexion);
  router.route("/roles-permisos/").get(checkAuth, verificarConexion);
  router.route("/contratistas/").get(checkAuth, verificarConexion);



export default router;
