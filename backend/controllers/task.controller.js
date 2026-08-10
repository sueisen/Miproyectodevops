/**
 * Controlador de la API REST de tareas.
 *
 * Responsable:
 * RAMIREZ LLANAS JONATHAN EDUARDO
 */

const taskService = require("../services/task.service");

const getTasks = (req, res) => {
  const tasks = taskService.getAllTasks();

  return res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
};

const getTaskById = (req, res) => {
  const task = taskService.getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada."
    });
  }

  return res.status(200).json({
    success: true,
    task
  });
};

const createTask = (req, res) => {
  const { title, description, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "El título de la tarea es obligatorio."
    });
  }

  const task = taskService.createTask({
    title: title.trim(),
    description,
    status
  });

  return res.status(201).json({
    success: true,
    message: "Tarea creada correctamente.",
    task
  });
};

const updateTask = (req, res) => {
  const { title, description, status } = req.body;

  if (
    title === undefined &&
    description === undefined &&
    status === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Debe enviar al menos un campo para actualizar."
    });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "El título no puede estar vacío."
    });
  }

  const task = taskService.updateTask(req.params.id, {
    title: title?.trim(),
    description,
    status
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada."
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tarea actualizada correctamente.",
    task
  });
};

const deleteTask = (req, res) => {
  const task = taskService.deleteTask(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Tarea no encontrada."
    });
  }

  return res.status(200).json({
    success: true,
    message: "Tarea eliminada correctamente.",
    task
  });
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};