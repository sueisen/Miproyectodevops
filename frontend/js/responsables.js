const API = "http://localhost:3000/api";

// const UsuariosPrueba = [
//     { id: 1, name: "Ramses" },
//     { id: 2, name: "Juan" },
//     { id: 3, name: "Pedro" }
// ];

// const TareasPrueba = [
//     { id: 1, title: "Tarea 1", description: "Descripcion de tarea 1" },
//     { id: 2, title: "Tarea 2", description: "Descripcion de tarea 2" },
//     { id: 3, title: "Tarea 3", description: "Descripcion de tarea 3" }
// ];

// let AsignacionesPrueba = [];
// let IdActualPrueba = 1;
// let usandoDatosPrueba = false;

let modalAsignar, modalCambiar;

document.addEventListener("DOMContentLoaded", () => {
    modalAsignar = new bootstrap.Modal(document.getElementById("modalAsignar"));
    modalCambiar = new bootstrap.Modal(document.getElementById("modalCambiar"));
    cargarAsignaciones();
});

async function apiFetch(url, opciones = {}) {
    try {
        const res = await fetch(url, {
            method: opciones.method,
            headers: opciones.headers,
            body: opciones.body,
            signal: AbortSignal.timeout(500)
        });
        if (!res.ok) return { error: "Error " + res.status };
        return await res.json();
    } catch {
        return null;
    }
}

function mostrarTabla(lista) {
    const tbody = document.getElementById("bodyTabla");
    if (!lista.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No hay asignaciones</td></tr>`;
        return;
    }
    tbody.innerHTML = lista.map(a => `
        <tr>
            <td>${a.id}</td>
            <td>${a.taskTitle}</td>
            <td>${a.taskDescription}</td>
            <td>${a.userName}</td>
            <td>${new Date(a.assignedAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="abrirCambiar(${a.id})">Cambiar</button>
                <button class="btn btn-sm btn-danger" onclick="eliminar(${a.id})">Eliminar</button>
            </td>
        </tr>
    `).join("");
}

async function cargarAsignaciones() {
    const data = await apiFetch(`${API}/asignaciones`);
    if (data && !data.error) {
        usandoDatosPrueba = false;
        return mostrarTabla(data);
    }
    usandoDatosPrueba = true;
    mostrarTabla(AsignacionesPrueba.map(a => ({
        id: a.id,
        taskTitle: TareasPrueba.find(t => t.id === a.taskId)?.title || "?",
        taskDescription: TareasPrueba.find(t => t.id === a.taskId)?.description || "?",
        userName: UsuariosPrueba.find(u => u.id === a.usuarioId)?.name || "?",
        assignedAt: a.fecha
    })));
}

async function cargarTareas() {
    const data = await apiFetch(`${API}/tareas`);
    const lista = (data && !data.error) ? data : TareasPrueba;
    usandoDatosPrueba = !data || data.error;
    document.getElementById("selectTarea").innerHTML =
        lista.map(t => `<option value="${t.id}">${t.title}</option>`).join("");
}

async function cargarUsuarios() {
    const data = await apiFetch(`${API}/usuarios`);
    const lista = (data && !data.error) ? data : UsuariosPrueba;
    usandoDatosPrueba = !data || data.error;
    const ops = lista.map(u => `<option value="${u.id}">${u.name}</option>`).join("");
    document.getElementById("selectUsuario").innerHTML = ops;
    document.getElementById("selectNuevoUsuario").innerHTML = ops;
}

async function asignar() {
    const taskId = parseInt(document.getElementById("selectTarea").value);
    const userId = parseInt(document.getElementById("selectUsuario").value);

    if (!usandoDatosPrueba) {
        const data = await apiFetch(`${API}/asignaciones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, userId })
        });
        if (data?.error) return alert(data.error);
        if (data) { modalAsignar.hide(); cargarAsignaciones(); return; }
    }

    if (AsignacionesPrueba.find(a => a.taskId === taskId))
        return alert("La tarea ya tiene un responsable asignado");
    AsignacionesPrueba.push({
        id: IdActualPrueba++, taskId, usuarioId: userId,
        fecha: new Date().toISOString()
    });
    modalAsignar.hide();
    cargarAsignaciones();
}

async function cambiar() {
    const id = parseInt(document.getElementById("idAsignacion").value);
    const newUserId = parseInt(document.getElementById("selectNuevoUsuario").value);

    if (!usandoDatosPrueba) {
        const data = await apiFetch(`${API}/asignaciones/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newUserId })
        });
        if (data?.error) return alert(data.error);
        if (data) { modalCambiar.hide(); cargarAsignaciones(); return; }
    }

    const a = AsignacionesPrueba.find(x => x.id === id);
    if (!a) return alert("Asignacion no encontrada");
    a.usuarioId = newUserId;
    modalCambiar.hide();
    cargarAsignaciones();
}

async function eliminar(id) {
    if (!confirm("¿Eliminar esta asignacion?")) return;

    if (!usandoDatosPrueba) {
        const data = await apiFetch(`${API}/asignaciones/${id}`, { method: "DELETE" });
        if (data?.error) return alert(data.error);
        if (data) { cargarAsignaciones(); return; }
    }

    AsignacionesPrueba = AsignacionesPrueba.filter(a => a.id !== id);
    cargarAsignaciones();
}

function abrirModalAsignar() {
    cargarTareas();
    cargarUsuarios();
    modalAsignar.show();
}

async function abrirCambiar(id) {
    document.getElementById("idAsignacion").value = id;
    await cargarUsuarios();
    if (!usandoDatosPrueba) {
        const data = await apiFetch(`${API}/asignaciones/tarea/${id}`);
        if (data && !data.error && data.userId)
            document.getElementById("selectNuevoUsuario").value = data.userId;
    } else {
        const a = AsignacionesPrueba.find(x => x.id === id);
        if (a) document.getElementById("selectNuevoUsuario").value = a.usuarioId;
    }
    modalCambiar.show();
}
