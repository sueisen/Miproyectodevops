const projectModel = require('../models/projectModel');

async function listProjects() {
  return projectModel.findAll();
}

async function getProject(id) {
  const project = await projectModel.findById(id);
  if (!project) {
    const error = new Error('Proyecto no encontrado');
    error.status = 404;
    throw error;
  }
  return project;
}

async function createProject(data) {
  if (!data.name || !data.owner_id) {
    const error = new Error('name y owner_id son obligatorios');
    error.status = 400;
    throw error;
  }
  return projectModel.create({
    name: data.name,
    description: data.description || null,
    owner_id: data.owner_id,
  });
}

async function updateProject(id, data) {
  await getProject(id); // valida que exista
  if (!data.name) {
    const error = new Error('name es obligatorio');
    error.status = 400;
    throw error;
  }
  return projectModel.update(id, {
    name: data.name,
    description: data.description || null,
  });
}

async function deleteProject(id) {
  await getProject(id); // valida que exista
  return projectModel.remove(id);
}

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject };