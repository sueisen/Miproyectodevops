jest.mock('../services/taskService', () => ({
  listTasks: jest.fn(),
  getTask: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));

const request = require('supertest');
const app = require('../app');
const taskService = require('../services/taskService');

describe('CRUD de tareas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Crear tarea', async () => {
    const newTask = {
      id: 1,
      project_id: 1,
      title: 'Tarea de prueba',
      description: 'Descripción inicial',
      status_id: 1
    };

    taskService.createTask.mockResolvedValue(newTask);

    const response = await request(app)
      .post('/api/tasks')
      .send({
        project_id: 1,
        title: 'Tarea de prueba',
        description: 'Descripción inicial',
        status_id: 1
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(newTask);
    expect(taskService.createTask).toHaveBeenCalledWith({
      project_id: 1,
      title: 'Tarea de prueba',
      description: 'Descripción inicial',
      status_id: 1
    });
  });

  test('Consultar tareas', async () => {
    const tasks = [
      {
        id: 1,
        project_id: 1,
        title: 'Tarea 1',
        description: 'Descripción',
        status_id: 1
      }
    ];

    taskService.listTasks.mockResolvedValue(tasks);

    const response = await request(app)
      .get('/api/tasks');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(tasks);
  });

  test('Consultar una tarea', async () => {
    const task = {
      id: 1,
      project_id: 1,
      title: 'Tarea 1',
      description: 'Descripción',
      status_id: 1
    };

    taskService.getTask.mockResolvedValue(task);

    const response = await request(app)
      .get('/api/tasks/1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(task);
    expect(taskService.getTask).toHaveBeenCalledWith('1');
  });

  test('Cambiar descripción de tarea', async () => {
    const updatedTask = {
      id: 1,
      project_id: 1,
      title: 'Tarea 1',
      description: 'Nueva descripción',
      status_id: 1
    };

    taskService.updateTask.mockResolvedValue(updatedTask);

    const response = await request(app)
      .put('/api/tasks/1')
      .send({
        title: 'Tarea 1',
        description: 'Nueva descripción',
        status_id: 1
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedTask);
    expect(taskService.updateTask).toHaveBeenCalledWith(
      '1',
      {
        title: 'Tarea 1',
        description: 'Nueva descripción',
        status_id: 1
      }
    );
  });

  test('Eliminar tarea', async () => {
    taskService.deleteTask.mockResolvedValue(true);

    const response = await request(app)
      .delete('/api/tasks/1');

    expect(response.statusCode).toBe(204);
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });
});