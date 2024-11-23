import mongoose from 'mongoose'; // Importa mongoose
import Usuario from "../models/Usuario.js";
import Trabajador from "../models/Trabajador.js";
import { departamentosInicialesUsuario } from "../config/departamentosInicialesUsuario.js";
import { departamentosInicialesTrabajador } from "../config/departamentosInicialesTrabajador.js";

const actualizarDepartamentos = async (req, res) => {
  try {
    // Validar y asignar departamentos iniciales o los enviados por el cliente
    const departamentosUsuario = req.body.departamentosUsuario || departamentosInicialesUsuario;
    const departamentosTrabajador = req.body.departamentosTrabajador || departamentosInicialesTrabajador;

    console.log("Actualizando usuarios...");
    const usuarios = await Usuario.find();

    // Actualizar usuarios
    const usuariosPromises = usuarios.map(async (usuario) => {
      const departamentosActuales = usuario.departamentos || [];

      // Crear un mapa para acceso rápido a los departamentos actuales por ID
      const departamentosMap = new Map(
        departamentosActuales
          .filter((d) => d && d.departamento) // Validar existencia de 'd' y 'd.departamento'
          .map((d) => [d.departamento.toString(), d]) // Convertir ID a string para el Map
      );

      usuario.departamentos = departamentosUsuario.map((departamentoNuevo) => {
        const departamentoExistente = departamentosMap.get(
          departamentoNuevo._id?.toString() // Validar que '_id' exista
        );

        if (departamentoExistente) {
          return {
            departamento: departamentoExistente.departamento,
            title: departamentoNuevo.title || departamentoExistente.title,
            items: departamentoNuevo.items.map((itemNuevo) => {
              const itemExistente = departamentoExistente.items?.find(
                (i) => i.name === itemNuevo.name
              );
              return {
                name: itemNuevo.name,
                active: itemExistente ? itemExistente.active : itemNuevo.active,
              };
            }),
          };
        } else {
          return {
            departamento: departamentoNuevo._id,
            title: departamentoNuevo.title,
            items: departamentoNuevo.items.map((item) => ({
              name: item.name,
              active: item.active,
            })),
          };
        }
      });

      await usuario.save();
      console.log(`Departamentos actualizados para el usuario ${usuario.email}`);
    });

    await Promise.all(usuariosPromises);

    console.log("Actualizando trabajadores...");
    const trabajadores = await Trabajador.find();

    // Actualizar trabajadores
    const trabajadoresPromises = trabajadores.map(async (trabajador) => {
      const departamentosActuales = trabajador.departamentos || [];

      // Crear un mapa para acceso rápido a los departamentos actuales por ID
      const departamentosMap = new Map(
        departamentosActuales
          .filter((d) => d && d.departamento) // Validar existencia de 'd' y 'd.departamento'
          .map((d) => [d.departamento.toString(), d]) // Convertir ID a string para el Map
      );

      trabajador.departamentos = departamentosTrabajador.map((departamentoNuevo) => {
        const departamentoExistente = departamentosMap.get(
          departamentoNuevo._id?.toString() // Validar que '_id' exista
        );

        if (departamentoExistente) {
          return {
            departamento: departamentoExistente.departamento,
            title: departamentoNuevo.title || departamentoExistente.title,
            items: departamentoNuevo.items.map((itemNuevo) => {
              const itemExistente = departamentoExistente.items?.find(
                (i) => i.name === itemNuevo.name
              );
              return {
                name: itemNuevo.name,
                active: itemExistente ? itemExistente.active : itemNuevo.active,
              };
            }),
          };
        } else {
          return {
            departamento: departamentoNuevo._id,
            title: departamentoNuevo.title,
            items: departamentoNuevo.items.map((item) => ({
              name: item.name,
              active: item.active,
            })),
          };
        }
      });

      await trabajador.save();
      console.log(`Departamentos actualizados para el trabajador ${trabajador.email}`);
    });

    await Promise.all(trabajadoresPromises);

    console.log("Actualización completada.");
    res.status(200).json({ message: "Actualización completada correctamente." });
  } catch (error) {
    console.error("Error durante la actualización:", error);
    res.status(500).json({
      message: "Error durante la actualización de los departamentos.",
      error: error.message,
    });
  } finally {
    // Manejo seguro de la conexión
    if (mongoose.connection.readyState !== 0) {
      try {
        await mongoose.connection.close();
        console.log("Conexión a la base de datos cerrada.");
      } catch (err) {
        console.error("Error al cerrar la conexión a la base de datos:", err.message);
      }
    }
  }
};

export { actualizarDepartamentos };
