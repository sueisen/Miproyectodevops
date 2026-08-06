const { createPool } = require('../config/db');

const pool = createPool();

async function findAll() {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.description, p.owner_id, p.created_at,
            u.name AS owner_name
     FROM projects p
     JOIN users u ON u.id = p.owner_id
     ORDER BY p.created_at DESC`
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT id, name, description, owner_id, created_at
     FROM projects WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function create({ name, description, owner_id }) {
  const [result] = await pool.query(
    `INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)`,
    [name, description, owner_id]
  );
  return findById(result.insertId);
}

async function update(id, { name, description }) {
  await pool.query(
    `UPDATE projects SET name = ?, description = ? WHERE id = ?`,
    [name, description, id]
  );
  return findById(id);
}

async function remove(id) {
  const [result] = await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };