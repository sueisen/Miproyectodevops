/**
 * Rutas de la API REST de tareas.
 *
 * Responsable:
 * RAMIREZ LLANAS JONATHAN EDUARDO
 */

const express = require("express");
const taskController = require("../controllers/task.controller");

const router = express.Router();

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;