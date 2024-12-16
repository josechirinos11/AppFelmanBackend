import express from "express";
const router = express.Router();
import checkAuth from "../middleware/authMiddleware.js";

import {
  buscarDepartamentos
} from "../controllers/departamentoController.js";



router.route("/items/").get(checkAuth, buscarDepartamentos);

export default router;
