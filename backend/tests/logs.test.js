const request = require('supertest');
const app = require('../app');
const logService = require('../services/log.service');
const mockDataService = require('../services/mockData.service');

describe('Registro de actividad (Logs)', () => {

    beforeEach(() => {
        logService._resetMemoryLogs();
        mockDataService._resetStores();
    });

    // ✅ Se registra el inicio de sesión
    test('Se registra el inicio de sesión', async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'campas', password: 'idsm41' });

        expect(loginResponse.statusCode).toBe(200);

        const logsResponse = await request(app).get('/api/logs');
        const loginLog = logsResponse.body.logs.find((log) => log.action === 'inicio_sesion');

        expect(loginLog).toBeDefined();
    });

    // ✅ Se registra la creación de un proyecto
    test('Se registra la creación de un proyecto', async () => {
        const projectResponse = await request(app)
            .post('/api/projects')
            .send({ name: 'Proyecto de prueba', description: 'Descripción' });

        expect(projectResponse.statusCode).toBe(201);
        const projectId = projectResponse.body.project.id;

        const logsResponse = await request(app).get('/api/logs');
        const projectLog = logsResponse.body.logs.find(
            (log) => log.action === 'crear_proyecto' && log.entity_id === projectId
        );

        expect(projectLog).toBeDefined();
        expect(projectLog.entity_type).toBe('project');
    });

    // ✅ Se registra la creación de una tarea
    test('Se registra la creación de una tarea', async () => {
        const projectResponse = await request(app)
            .post('/api/projects')
            .send({ name: 'Proyecto con tareas' });
        const projectId = projectResponse.body.project.id;

        const taskResponse = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .send({ title: 'Tarea de prueba', description: 'Descripción' });

        expect(taskResponse.statusCode).toBe(201);
        const taskId = taskResponse.body.task.id;

        const logsResponse = await request(app).get('/api/logs');
        const taskLog = logsResponse.body.logs.find(
            (log) => log.action === 'crear_tarea' && log.entity_id === taskId
        );

        expect(taskLog).toBeDefined();
        expect(taskLog.entity_type).toBe('task');
    });

    // ✅ Se registra el cambio de estado
    test('Se registra el cambio de estado', async () => {
        const projectResponse = await request(app)
            .post('/api/projects')
            .send({ name: 'Proyecto con tareas' });
        const projectId = projectResponse.body.project.id;

        const taskResponse = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .send({ title: 'Tarea de prueba' });
        const taskId = taskResponse.body.task.id;

        const statusResponse = await request(app)
            .patch(`/api/tasks/${taskId}/status`)
            .send({ status: 'En progreso' });

        expect(statusResponse.statusCode).toBe(200);
        expect(statusResponse.body.task.status).toBe('En progreso');

        const logsResponse = await request(app).get('/api/logs');
        const statusLog = logsResponse.body.logs.find(
            (log) => log.action === 'cambio_estado' && log.entity_id === taskId
        );

        expect(statusLog).toBeDefined();
        expect(statusLog.entity_type).toBe('task');
    });
});
