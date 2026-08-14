const { createPool } = require('../config/db');

const pool = createPool();

async function findAll() {
  const [rows] = await pool.query(
    `SELECT id, project_id, title, description, status_id, created_at, updated_at
     FROM tasks
     ORDER BY id ASC`
  );

  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, project_id, title, description, status_id, created_at, updated_at
     FROM tasks
     WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function create({ project_id, title, description, status_id }) {
  const [result] = await pool.query(
    `INSERT INTO tasks
      (project_id, title, description, status_id)
     VALUES (?, ?, ?, ?)`,
    [project_id, title, description, status_id]
  );

  return findById(result.insertId);
}

async function update(id, { title, description, status_id }) {
  await pool.query(
    `UPDATE tasks
     SET title = ?, description = ?, status_id = ?
     WHERE id = ?`,
    [title, description, status_id, id]
  );

  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query(
    `DELETE FROM tasks
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};