const projectService = require('../services/projectService');

async function getAll(req, res, next) {
  try {
    const projects = await projectService.listProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const project = await projectService.getProject(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getOne, create, update, remove };