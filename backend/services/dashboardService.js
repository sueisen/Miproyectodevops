const { createPool } = require('../config/db');

const pool = createPool();

async function getDashboardStats() {
  // Total de proyectos
  const [projRows] = await pool.query('SELECT COUNT(*) AS total FROM projects');
  const totalProjects = projRows[0].total;

  // Total de tareas
  const [taskRows] = await pool.query('SELECT COUNT(*) AS total FROM tasks');
  const totalTasks = taskRows[0].total;

  // Pendientes (status_id = id del estado "Pendiente")
  const [pendingRows] = await pool.query(`
    SELECT COUNT(*) AS total FROM tasks 
    WHERE status_id = (SELECT id FROM statuses WHERE name = 'Pendiente')
  `);
  const pending = pendingRows[0].total;

  // Finalizadas (status_id = id del estado "Completada")
  const [completedRows] = await pool.query(`
    SELECT COUNT(*) AS total FROM tasks 
    WHERE status_id = (SELECT id FROM statuses WHERE name = 'Completada')
  `);
  const completed = completedRows[0].total;

  return {
    totalProjects,
    totalTasks,
    pending,
    completed
  };
}

module.exports = { getDashboardStats };