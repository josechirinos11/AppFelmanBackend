import express from "express";
const router = express.Router();
import {
  registrar,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  buscarUsuarioID,
  actualizarUsuario,
  actualizarDepartamentosUsuario
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js";



// área publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);// se usas  la confirmacion del envio del correo
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
// hay dos formas de hacer este ruta 
// router.get("/olvide-password/:token", comprobarToken);
// router.post("/olvide-password/:token", nuevoPassword);
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);



// Area privada

router.route("/recursos-humanos/:id").get(checkAuth, buscarUsuarioID);  // Ruta GET para traer trabajadores, protegida con checkAuth
router.route("/recursos-humanos/:id").put(checkAuth, actualizarUsuario)
router.route("/recursos-humanos/departamentos/:id").put(checkAuth, actualizarDepartamentosUsuario)



export default router;
