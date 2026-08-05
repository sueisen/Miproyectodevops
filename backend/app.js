const express = require("express");
const logService = require("./services/log.service");
const mockDataService = require("./services/mockData.service");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal para pruebas de integración (incoming)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Servidor funcionando correctamente"
  });
});

// Ruta para el código login (current)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    // Validación de datos
    if (!username || !password || username.trim() === "" || password.trim() === "") {
        return res.status(400).json({ success: false, message: 'Campos vacios no permiten enviar el formulario.' });
    }

    // Simulación de datos para entrar al login
    const usuarioValido = "campas";
    const contrasenaValida = "idsm41";

    // En caso de usuario invalido
    if (username !== usuarioValido) {
        return res.status(401).json({ success: false, message: 'Usuario incorrecto muestra error.' });
    }

    // Caso de contraseña invalida
    if (password !== contrasenaValida) {
        return res.status(401).json({ success: false, message: 'Contraseña incorrecta muestra error.' });
    }

    // Registro de actividad: inicio de sesión exitoso
    try {
        await logService.registrarLog({
            action: 'inicio_sesion',
            entityType: 'user',
            entityId: null
        });
    } catch (err) {
        console.error('No se pudo registrar el log de inicio de sesión:', err.message);
    }

    // Caso de validación correcto
    return res.status(200).json({
        success: true,
        message: 'Usuario valido inicia sesion.',
        user: { username: usuarioValido }
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