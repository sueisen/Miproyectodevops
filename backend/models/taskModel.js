const { createPool } = require("../config/db");

const pool = createPool();

async function findAll() {
  const [rows] = await pool.query(
    `SELECT
        id,
        project_id,
        title,
        description,
        status_id
     FROM tasks
     ORDER BY id`
  );

  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT
        id,
        project_id,
        title,
        description,
        status_id
     FROM tasks
     WHERE id = ?`,
    [id]
  );

  return rows[0];
}

async function create(task) {
  const [result] = await pool.query(
    `INSERT INTO tasks
    (project_id,title,description,status_id)
    VALUES (?,?,?,?)`,
    [
      task.project_id,
      task.title,
      task.description,
      task.status_id
    ]
  );

  return findById(result.insertId);
}

async function update(id, task) {
  await pool.query(
    `UPDATE tasks
        SET description = ?
      WHERE id = ?`,
    [
      task.description,
      id
    ]
  );

  return findById(id);
}

async function remove(id) {
  return pool.query(
    "DELETE FROM tasks WHERE id=?",
    [id]
  );
}

async function updateStatus(id, statusId) {

    await pool.query(
        `UPDATE tasks
         SET status_id = ?
         WHERE id = ?`,
        [statusId, id]
    );

    return findById(id);

}

module.exports = {
    findAll,
    findById,
    create,
    update,
    updateStatus,
    remove
};