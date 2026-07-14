const express = require("express");
const {
    asignarResponsableController,
    cambiarResponsableController,
    eliminarResponsableController,
    obtenerAsignacionesTareaController,
    obtenerTodasAsignacionesController,
    obtenerUsuariosController,
    obtenerTareasController
} = require("../controllers/asignacionController");

const router = express.Router();

router.post("/asignaciones", asignarResponsableController);
router.put("/asignaciones/:id", cambiarResponsableController);
router.delete("/asignaciones/:id", eliminarResponsableController);
router.get("/asignaciones/tarea/:taskId", obtenerAsignacionesTareaController);
router.get("/asignaciones", obtenerTodasAsignacionesController);
router.get("/usuarios", obtenerUsuariosController);
router.get("/tareas", obtenerTareasController);

module.exports = router;
