import express from "express";
const router = express.Router();
import {
  registrar,
  confirmar
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js";



// área publica
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);


// Area privada


export default router;
