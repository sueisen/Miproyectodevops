const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");


// Obtener todas las tareas
router.get(
    "/",
    taskController.getAll
);


// Obtener una tarea
router.get(
    "/:id",
    taskController.getOne
);


// Crear tarea
router.post(
    "/",
    taskController.create
);


// Actualizar tarea
router.put(
    "/:id",
    taskController.update
);


// Eliminar tarea
router.delete(
    "/:id",
    taskController.remove
);

router.patch(
    "/:id/status",
    taskController.changeStatus
);

module.exports = router;