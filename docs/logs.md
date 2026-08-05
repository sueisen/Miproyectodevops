# Registro de actividad (Logs)

Registra en la tabla `activity_logs` (o en memoria si no hay MySQL
configurado) las acciones más importantes del sistema.

## Acciones registradas

| Acción            | Cuándo se dispara                          | `entity_type` |
|--------------------|---------------------------------------------|----------------|
| `inicio_sesion`    | Login exitoso (`POST /api/auth/login`)       | `user`         |
| `crear_proyecto`   | Crear proyecto (`POST /api/projects`)        | `project`      |
| `crear_tarea`      | Crear tarea (`POST /api/projects/:id/tasks`) | `task`         |
| `cambio_estado`    | Cambiar estado (`PATCH /api/tasks/:id/status`)| `task`        |

## Cómo funciona

`backend/services/log.service.js` expone `registrarLog(...)` y
`obtenerLogs()`:

- Si `backend/.env` tiene `DB_HOST`, `DB_USER` y `DB_NAME` configurados,
  los logs se guardan en la tabla `activity_logs` (ver
  `database/scripts/create_tables.sql`).
- Si no hay base de datos configurada (por ejemplo en CI o al correr
  `npm test` localmente sin MySQL), los logs se guardan en un arreglo en
  memoria. Esto permite que las pruebas automatizadas corran siempre,
  igual que las del login actual (que también está simulado).

Consultar los logs registrados:

```
GET /api/logs
```

## Nota sobre proyectos y tareas

Las rutas `POST /api/projects`, `POST /api/projects/:id/tasks` y
`PATCH /api/tasks/:id/status` usan por ahora un almacenamiento temporal
en memoria (`backend/services/mockData.service.js`), ya que el CRUD
real con persistencia en MySQL es responsabilidad de las Issues de
"Proyectos" y "Estados de tarea" (ramas `feature/proyectos` y
`feature/states`). Cuando esas Issues se integren a `develop`, sus
controladores/modelos deben llamar a `logService.registrarLog(...)` en
los mismos puntos y `mockData.service.js` puede eliminarse.

## Pruebas

`backend/tests/logs.test.js` verifica las 4 acciones anteriores usando
supertest, sin depender de una base de datos real.

```bash
cd backend
npm test
```
