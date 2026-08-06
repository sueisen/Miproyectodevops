const path = require("path");
const express = require("express");
const logService = require("./services/log.service");
const mockDataService = require("./services/mockData.service");
const asignacionRoutes = require("./routers/asignacionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck para pruebas de integración y monitoreo
app.get("/api/status", (req, res) => {
  res.status(200).json({
    message: "Servidor funcionando correctamente"
  });
});

app.use("/api", asignacionRoutes);

// Sirve el frontend estático (login, dashboard, css, js).
// "/" sirve frontend/index.html, que redirige a la pantalla de login.
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Usuario admin fijo mientras no hay tabla de usuarios real conectada.
const ADMIN_USERNAME = "campas";
const ADMIN_PASSWORD = "idsm41";

// Ruta para el código login (current)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ success: false, message: 'Campos vacios no permiten enviar el formulario.' });
    }

    const isAdmin = username === ADMIN_USERNAME;
    const registeredUser = mockDataService.obtenerUsuarioPorUsername(username);

    if (!isAdmin && !registeredUser) {
        return res.status(401).json({ success: false, message: 'Usuario incorrecto muestra error.' });
    }

    const validPassword = isAdmin ? ADMIN_PASSWORD : registeredUser.password;

    if (password !== validPassword) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta muestra error.' });
    }

    try {
        await logService.registrarLog({
            action: 'inicio_sesion',
            entityType: 'user',
            entityId: registeredUser ? registeredUser.id : null
        });
    } catch (err) {
        console.error('No se pudo registrar el log de inicio de sesión:', err.message);
    }

    return res.status(200).json({
        success: true,
        message: 'Usuario valido inicia sesion.',
        user: { username: isAdmin ? ADMIN_USERNAME : registeredUser.username }
    });
});

// Ruta para registrar un usuario nuevo (mock en memoria, registra actividad)
app.post('/api/auth/register', async (req, res) => {
    const { username, password, name } = req.body;

    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son obligatorios.' });
    }

    if (username === ADMIN_USERNAME || mockDataService.obtenerUsuarioPorUsername(username)) {
        return res.status(409).json({ success: false, message: 'Ese usuario ya existe.' });
    }

    const user = mockDataService.crearUsuario({ username, password, name });

    await logService.registrarLog({
        action: 'registro_usuario',
        entityType: 'user',
        entityId: user.id
    });

    return res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente.',
        user: { id: user.id, username: user.username, name: user.name }
    });
});

// Ruta para crear un proyecto (registra actividad)
app.post('/api/projects', async (req, res) => {
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
        return res.status(400).json({ success: false, message: 'El nombre del proyecto es obligatorio.' });
    }

    const project = mockDataService.crearProyecto({ name, description });

    await logService.registrarLog({
        action: 'crear_proyecto',
        entityType: 'project',
        entityId: project.id
    });

    return res.status(201).json({ success: true, project });
});

// Ruta para listar todos los proyectos
app.get('/api/projects', async (req, res) => {
    const projects = mockDataService.listarProyectos();
    return res.status(200).json({ success: true, projects });
});

// Ruta para obtener un proyecto por id
app.get('/api/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const project = mockDataService.obtenerProyecto(projectId);

    if (!project) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    return res.status(200).json({ success: true, project });
});

// Ruta para editar un proyecto (registra actividad)
app.put('/api/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    if (name !== undefined && name.trim() === "") {
        return res.status(400).json({ success: false, message: 'El nombre del proyecto no puede estar vacío.' });
    }

    const project = mockDataService.actualizarProyecto(projectId, { name, description });

    if (!project) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    await logService.registrarLog({
        action: 'editar_proyecto',
        entityType: 'project',
        entityId: project.id
    });

    return res.status(200).json({ success: true, project });
});

// Ruta para eliminar un proyecto (registra actividad)
app.delete('/api/projects/:projectId', async (req, res) => {
    const { projectId } = req.params;

    const eliminado = mockDataService.eliminarProyecto(projectId);

    if (!eliminado) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    await logService.registrarLog({
        action: 'eliminar_proyecto',
        entityType: 'project',
        entityId: Number(projectId)
    });

    return res.status(200).json({ success: true, message: 'Proyecto eliminado correctamente.' });
});

// Ruta para crear una tarea dentro de un proyecto (registra actividad)
app.post('/api/projects/:projectId/tasks', async (req, res) => {
    const { projectId } = req.params;
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ success: false, message: 'El título de la tarea es obligatorio.' });
    }

    const project = mockDataService.obtenerProyecto(projectId);
    if (!project) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    const task = mockDataService.crearTarea(projectId, { title, description });

    await logService.registrarLog({
        action: 'crear_tarea',
        entityType: 'task',
        entityId: task.id
    });

    return res.status(201).json({ success: true, task });
});

// Ruta para cambiar el estado de una tarea (registra actividad)
app.patch('/api/tasks/:taskId/status', async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status || status.trim() === "") {
        return res.status(400).json({ success: false, message: 'El nuevo estado es obligatorio.' });
    }

    const task = mockDataService.cambiarEstadoTarea(taskId, status);
    if (!task) {
        return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    }

    await logService.registrarLog({
        action: 'cambio_estado',
        entityType: 'task',
        entityId: task.id
    });

    return res.status(200).json({ success: true, task });
});

// Ruta para consultar el registro de actividad
app.get('/api/logs', async (req, res) => {
    const logs = await logService.obtenerLogs();
    return res.status(200).json({ success: true, logs });
});

// Ejecución del servidor solo si se corre directamente
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
}

module.exports = app;