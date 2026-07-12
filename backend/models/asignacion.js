import { asignaciones, usuarios, tareas } from "../../database/mock/mockData.js";

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function asignarResponsable(taskId, userId) {
    await delay(50);
    const tareaExiste = tareas.find(t => t.id === taskId);

    if (!tareaExiste) return { error: "Tarea no encontrada" };

    const usuarioExiste = usuarios.find(u => u.id === userId);

    if (!usuarioExiste) return { error: "Usuario no encontrado" };

    const isAsignado = asignaciones.find(a => a.taskId === taskId);

    if (isAsignado) return { error: "La tarea ya tiene un responsable asignado" };

    const asignacion = {
        id: asignaciones.length + 1,
        taskId: taskId,
        userId: userId,
        assignedAt: new Date().toISOString()
    };
    asignaciones.push(asignacion);
    return asignacion;
}

async function cambiarResponsable(id, newUserId) {
    await delay(50);
    const asignacion = asignaciones.find(a => a.id === id);
    if (!asignacion) return { error: "Asignacion no encontrada" };

    const usuarioExiste = usuarios.find(u => u.id === newUserId);
    if (!usuarioExiste) return { error: "Usuario no encontrado" };

    asignacion.userId = newUserId;
    return asignacion;
}

async function eliminarResponsable(id) {
    await delay(50);
    const index = asignaciones.findIndex(a => a.id === id);
    if (index === -1) return { error: "Asignacion no encontrada" };

    asignaciones.splice(index, 1);
    return { mensaje: "Asignacion eliminada correctamente" };
}

async function obtenerAsignacionesTarea(taskId) {
    await delay(50);
    const asignacion = asignaciones.find(a => a.taskId === taskId);
    if (!asignacion) return { error: "No hay asignacion para esta tarea" };

    const usuario = usuarios.find(u => u.id === asignacion.userId);
    const tarea = tareas.find(t => t.id === asignacion.taskId);

    return {
        id: asignacion.id,
        taskId: asignacion.taskId,
        userId: asignacion.userId,
        assignedAt: asignacion.assignedAt,
        userName: usuario ? usuario.name : "Desconocido",
        taskTitle: tarea ? tarea.title : "Desconocida",
        taskDescription: tarea ? tarea.description : "Sin descripcion"
    };
}

async function obtenerTodasAsignaciones() {
    await delay(50);
    return asignaciones.map(a => {
        const usuario = usuarios.find(u => u.id === a.userId);
        const tarea = tareas.find(t => t.id === a.taskId);
        return {
            id: a.id,
            taskId: a.taskId,
            userId: a.userId,
            assignedAt: a.assignedAt,
            userName: usuario ? usuario.name : "Desconocido",
            taskTitle: tarea ? tarea.title : "Desconocida",
            taskDescription: tarea ? tarea.description : "Sin descripcion"
        };
    });
}

async function obtenerUsuarios() {
    return usuarios;
}

async function obtenerTareas() {
    return tareas;
}

export {
    asignarResponsable,
    cambiarResponsable,
    eliminarResponsable,
    obtenerAsignacionesTarea,
    obtenerTodasAsignaciones,
    obtenerUsuarios,
    obtenerTareas
};
