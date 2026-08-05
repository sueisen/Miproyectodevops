-- Datos de ejemplo para verificar manualmente el esquema (Issue #2)

USE myproyectodevops;

INSERT INTO statuses (name) VALUES
  ('Pendiente'), ('En progreso'), ('Completada'), ('Cancelada');

INSERT INTO users (name, email, password_hash, role) VALUES
  ('Admin Demo', 'admin@example.com', 'hash_demo', 'admin');

INSERT INTO projects (name, description, owner_id) VALUES
  ('Proyecto Demo', 'Proyecto de ejemplo para pruebas', 1);

INSERT INTO tasks (project_id, title, description, status_id) VALUES
  (1, 'Tarea de ejemplo', 'Tarea creada para verificar el esquema', 1);

INSERT INTO task_assignments (task_id, user_id) VALUES
  (1, 1);
