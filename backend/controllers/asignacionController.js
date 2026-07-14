const {
    asignarResponsable, cambiarResponsable, eliminarResponsable,
    obtenerAsignacionesTarea, obtenerTodasAsignaciones,
    obtenerUsuarios, obtenerTareas
} = require("../models/asignacion");

async function asignarResponsableController(req, res) {
    const { taskId, userId } = req.body;
    if (!taskId || !userId) {
        return res.status(400).json({ error: "Se requieren una tarea y un usuario" });
    }
    const result = await asignarResponsable(taskId, userId);
    return result.error
        ? res.status(400).json(result)
        : res.status(201).json(result);
}

async function cambiarResponsableController(req, res) {
    const id = parseInt(req.params.id);
    const { newUserId } = req.body;
    if (!newUserId) {
        return res.status(400).json({ error: "Se requiere un nuevo usuario" });
    }
    const result = await cambiarResponsable(id, newUserId);
    return result.error
        ? res.status(404).json(result)
        : res.json(result);
}

async function eliminarResponsableController(req, res) {
    const id = parseInt(req.params.id);
    const result = await eliminarResponsable(id);
    return result.error
        ? res.status(404).json(result)
        : res.json(result);
}

async function obtenerAsignacionesTareaController(req, res) {
    const taskId = parseInt(req.params.taskId);
    const result = await obtenerAsignacionesTarea(taskId);
    return result.error
        ? res.status(404).json(result)
        : res.json(result);
}

async function obtenerTodasAsignacionesController(req, res) {
    const result = await obtenerTodasAsignaciones();
    res.json(result);
}

async function obtenerUsuariosController(req, res) {
    const result = await obtenerUsuarios();
    res.json(result);
}

async function obtenerTareasController(req, res) {
    const result = await obtenerTareas();
    res.json(result);
}

module.exports = {
    asignarResponsableController,
    cambiarResponsableController,
    eliminarResponsableController,
    obtenerAsignacionesTareaController,
    obtenerTodasAsignacionesController,
    obtenerUsuariosController,
    obtenerTareasController
};
