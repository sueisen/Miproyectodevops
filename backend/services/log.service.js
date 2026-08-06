const { createPool, isDatabaseConfigured } = require('../config/db');

// Si hay credenciales de MySQL configuradas (.env) usamos la tabla real activity_logs. Si no (por ejemplo en CI o al correr las pruebas sin
// MySQL instalado), guardamos los registros en memoria para que la funcionalidad y sus pruebas sigan funcionando igual.
const pool = isDatabaseConfigured() ? createPool() : null;

// Usuario admin sembrado por database/seed/seed.sql (id 1). Se usa como
// autor del log del login mientras el login siga simulado y no dependa de una tabla de usuarios real.
const DEFAULT_USER_ID = 1;

let memoryLogs = [];
let nextMemoryId = 1;

/**
 * Registra una acción de actividad (login, creación de proyecto,
 * creación de tarea, cambio de estado, etc.).
 */
async function registrarLog({ userId = DEFAULT_USER_ID, action, entityType = null, entityId = null } = {}) {
  if (!action || String(action).trim() === '') {
    throw new Error('La acción del log es obligatoria');
  }

  if (pool) {
    const [result] = await pool.query(
      'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [userId, action, entityType, entityId]
    );
    return {
      id: result.insertId,
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      created_at: new Date()
    };
  }

  const entry = {
    id: nextMemoryId++,
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    created_at: new Date()
  };
  memoryLogs.push(entry);
  return entry;
}

/** Devuelve los logs registrados, del más reciente al más antiguo. */
async function obtenerLogs() {
  if (pool) {
    const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY created_at DESC');
    return rows;
  }
  return [...memoryLogs].reverse();
}

/** Solo para pruebas: limpia los logs guardados en memoria. */
function _resetMemoryLogs() {
  memoryLogs = [];
  nextMemoryId = 1;
}

module.exports = {
  registrarLog,
  obtenerLogs,
  _resetMemoryLogs,
  isUsingDatabase: () => Boolean(pool)
};