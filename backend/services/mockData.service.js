// Almacenamiento temporal en memoria para proyectos y tareas.
//
// El CRUD real (con persistencia en MySQL usando las tablas `projects`
// y `tasks` del esquema) es responsabilidad de las Issues de
// "Proyectos" y "Estados de tarea" (ver ramas feature/proyectos y feature/states). 
// proyectos/tareas y cambiar su estado mientras se construye la funcionalidad de Registro de actividad (Logs), y debe reemplazarse
// por los modelos reales cuando esas Issues se integren a develop.

let projects = [];
let tasks = [];
let nextProjectId = 1;
let nextTaskId = 1;

function crearProyecto({ name, description = null }) {
  const project = {
    id: nextProjectId++,
    name,
    description,
    created_at: new Date()
  };
  projects.push(project);
  return project;
}

function obtenerProyecto(id) {
  return projects.find((project) => project.id === Number(id));
}

function listarProyectos() {
  return projects;
}

function actualizarProyecto(id, { name, description }) {
  const project = obtenerProyecto(id);
  if (!project) return null;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  return project;
}

function eliminarProyecto(id) {
  const index = projects.findIndex((project) => project.id === Number(id));
  if (index === -1) return false;
  projects.splice(index, 1);
  return true;
}

function crearTarea(projectId, { title, description = null }) {
  const task = {
    id: nextTaskId++,
    project_id: Number(projectId),
    title,
    description,
    status: 'Pendiente',
    created_at: new Date(),
    updated_at: new Date()
  };
  tasks.push(task);
  return task;
}

function obtenerTarea(id) {
  return tasks.find((task) => task.id === Number(id));
}

function listarTareas(projectId) {
  if (projectId !== undefined) {
    return tasks.filter((task) => task.project_id === Number(projectId));
  }
  return tasks;
}

function actualizarTarea(id, { title, description }) {
  const task = obtenerTarea(id);
  if (!task) return null;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  task.updated_at = new Date();
  return task;
}

function eliminarTarea(id) {
  const index = tasks.findIndex((task) => task.id === Number(id));
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

function cambiarEstadoTarea(id, status) {
  const task = obtenerTarea(id);
  if (!task) return null;
  task.status = status;
  task.updated_at = new Date();
  return task;
}

/** Solo para pruebas: limpia los datos guardados en memoria. */
function _resetStores() {
  projects = [];
  tasks = [];
  nextProjectId = 1;
  nextTaskId = 1;
}

module.exports = {
  crearProyecto,
  obtenerProyecto,
  listarProyectos,
  actualizarProyecto,
  eliminarProyecto,
  crearTarea,
  obtenerTarea,
  listarTareas,
  actualizarTarea,
  eliminarTarea,
  cambiarEstadoTarea,
  _resetStores
};