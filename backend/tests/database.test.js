const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createPool, isDatabaseConfigured, ensureDatabaseExists } = require('../config/db');

const configured = isDatabaseConfigured();
const expectedTables = ['users', 'statuses', 'projects', 'tasks', 'task_assignments', 'activity_logs'];

describe(
  'Base de datos (Issue #2)',
  { skip: !configured && 'DB_HOST/DB_USER/DB_NAME no configurados: prueba omitida en este entorno' },
  () => {
    let pool;
    let insertedId;

    before(async () => {
      await ensureDatabaseExists();
      pool = createPool();
    });

    it('la base de datos se conecta', async () => {
      const connection = await pool.getConnection();
      connection.release();
    });

    it('se crean las tablas correctamente', async () => {
      const sqlPath = path.join(__dirname, '..', '..', 'database', 'scripts', 'create_tables.sql');
      const statements = fs
        .readFileSync(sqlPath, 'utf8')
        .split(';')
        .map((statement) => statement.trim())
        .filter((statement) => statement && !/^CREATE DATABASE/i.test(statement) && !/^USE /i.test(statement));

      for (const statement of statements) {
        await pool.query(statement);
      }

      const [tables] = await pool.query('SHOW TABLES');
      const tableNames = tables.map((row) => Object.values(row)[0]);

      for (const expected of expectedTables) {
        assert.ok(tableNames.includes(expected), `Falta la tabla ${expected}`);
      }
    });

    it('se puede insertar un registro de prueba', async () => {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
        ['Usuario de Prueba', `test-${Date.now()}@example.com`, 'hash_de_prueba']
      );
      insertedId = result.insertId;
      assert.ok(insertedId > 0);
    });

    it('se puede consultar ese registro', async () => {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [insertedId]);
      assert.equal(rows.length, 1);
      assert.equal(rows[0].name, 'Usuario de Prueba');
    });

    after(async () => {
      if (insertedId) {
        await pool.query('DELETE FROM users WHERE id = ?', [insertedId]);
      }
      await pool.end();
    });
  }
);
