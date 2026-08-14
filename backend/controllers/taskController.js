const taskService = require('../services/taskService');

async function getAll(req, res, next) {
  try {
    const tasks = await taskService.listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskService.getTask(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.body
    );

    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove
};