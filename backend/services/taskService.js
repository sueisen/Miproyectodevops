const taskModel = require('../models/taskModel');

async function listTasks() {
  return taskModel.findAll();
}

async function getTask(id) {
  const task = await taskModel.findById(id);

  if (!task) {
    const error = new Error('Tarea no encontrada');
    error.status = 404;
    throw error;
  }

  return task;
}

async function createTask(data) {
  if (!data.project_id || !data.title || !data.status_id) {
    const error = new Error(
      'project_id, title y status_id son obligatorios'
    );
    error.status = 400;
    throw error;
  }

  return taskModel.create({
    project_id: data.project_id,
    title: data.title,
    description: data.description || null,
    status_id: data.status_id
  });
}

async function updateTask(id, data) {
  await getTask(id);

  if (!data.title || !data.status_id) {
    const error = new Error(
      'title y status_id son obligatorios'
    );
    error.status = 400;
    throw error;
  }

  return taskModel.update(id, {
    title: data.title,
    description: data.description || null,
    status_id: data.status_id
  });
}

async function deleteTask(id) {
  await getTask(id);

  return taskModel.remove(id);
}

module.exports = {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
};