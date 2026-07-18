# Base de datos — MyProyectoDevOps

Diseño de la base de datos (MySQL) para la Issue #2.

## Tablas y relaciones

- **users**: usuarios del sistema (login, dueños de proyectos, responsables de tareas).
- **statuses**: catálogo de estados posibles de una tarea (Pendiente, En progreso, Completada, Cancelada).
- **projects**: proyectos, cada uno pertenece a un usuario (`owner_id` → `users.id`).
- **tasks**: tareas de un proyecto (`project_id` → `projects.id`), cada una con un estado (`status_id` → `statuses.id`).
- **task_assignments**: relación muchos a muchos entre `tasks` y `users` para asignar responsables.
- **activity_logs**: registro de actividad de los usuarios (`user_id` → `users.id`).

## Cómo crear el esquema manualmente

```bash
mysql -u root -p < database/scripts/create_tables.sql
mysql -u root -p < database/seed/seed.sql
```

## Cómo correr las pruebas automatizadas

Requiere un servidor MySQL accesible y las variables de entorno definidas en `backend/.env` (ver `backend/.env.example`).

```bash
cd backend
npm install
npm test
```

Si no hay variables de entorno de base de datos configuradas, las pruebas de este módulo se omiten (skip) en lugar de fallar.
