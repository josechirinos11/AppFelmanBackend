import express from "express";
const router = express.Router();
import {
actualizarDepartamentos,
  
} from "../controllers/administradorController.js";
import checkAuth from "../middleware/authMiddleware.js";
import dotenv from "dotenv";



// área publica
router.post("/", actualizarDepartamentos);


export default router;