/**
 * Servicio encargado de administrar tareas.
 *
 * Responsable:
 * RAMIREZ LLANAS JONATHAN EDUARDO
 */

let tasks = [
  {
    id: 1,
    title: "Configurar repositorio",
    description: "Preparar el repositorio para trabajar con Git",
    status: "pendiente"
  },
  {
    id: 2,
    title: "Crear API REST",
    description: "Desarrollar los endpoints CRUD",
    status: "en progreso"
  }
];

let nextId = 3;


const getAllTasks = () => {
  return tasks;
};

const getTaskById = (id) => {
  return tasks.find((task) => task.id === Number(id));
};

const createTask = ({ title, description, status }) => {
  const newTask = {
    id: nextId++,
    title,
    description: description || "",
    status: status || "pendiente"
  };

  tasks.push(newTask);

  return newTask;
};

const updateTask = (id, data) => {
  const task = getTaskById(id);

  if (!task) {
    return null;
  }

  task.title = data.title ?? task.title;
  task.description = data.description ?? task.description;
  task.status = data.status ?? task.status;

  return task;
};

const deleteTask = (id) => {
  const index = tasks.findIndex((task) => task.id === Number(id));

  if (index === -1) {
    return null;
  }

  const deletedTask = tasks[index];
  tasks.splice(index, 1);

  return deletedTask;
};

const resetTasks = () => {
  tasks = [
    {
      id: 1,
      title: "Configurar repositorio",
      description: "Preparar el repositorio para trabajar con Git",
      status: "pendiente"
    },
    {
      id: 2,
      title: "Crear API REST",
      description: "Desarrollar los endpoints CRUD",
      status: "en progreso"
    }
  ];

  nextId = 3;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  resetTasks
};