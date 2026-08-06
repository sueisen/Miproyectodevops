const usuarios = [
    {id: 1, name: "Ramses", email: "ramses@example.com", role: "admin"},
    {id: 2, name: "Juan", email: "juan@example.com", role: "user"},
    {id: 3, name: "Pedro", email: "pedro@example.com", role: "user"}
];

const tareas = [
    {id: 1, project_id: 1, title: "Tarea 1", description: "Descripcion 1", status_id: 1},
    {id: 2, project_id: 1, title: "Tarea 2", description: "Descripcion 2", status_id: 1},
    {id: 3, project_id: 1, title: "Tarea 3", description: "Descripcion 3", status_id: 1}
];

const asignaciones = [];

module.exports = { usuarios, tareas, asignaciones };
