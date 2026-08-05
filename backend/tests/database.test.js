const fs = require('node:fs');
const path = require('node:path');
const { createPool, isDatabaseConfigured, ensureDatabaseExists } = require('../config/db');

const configured = isDatabaseConfigured();
const expectedTables = ['users', 'statuses', 'projects', 'tasks', 'task_assignments', 'activity_logs'];

const describeIfConfigured = configured ? describe : describe.skip;

describeIfConfigured('Base de datos (Issue #2)', () => {
  let pool;
  let insertedId;

  beforeAll(async () => {
    await ensureDatabaseExists();
    pool = createPool();
  });

  test('la base de datos se conecta', async () => {
    const connection = await pool.getConnection();
    connection.release();
  });

  test('se crean las tablas correctamente', async () => {
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
      expect(tableNames).toContain(expected);
    }
  });

  test('se puede insertar un registro de prueba', async () => {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      ['Usuario de Prueba', `test-${Date.now()}@example.com`, 'hash_de_prueba']
    );
    insertedId = result.insertId;
    expect(insertedId).toBeGreaterThan(0);
  });

  test('se puede consultar ese registro', async () => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [insertedId]);
    expect(rows.length).toBe(1);
    expect(rows[0].name).toBe('Usuario de Prueba');
  });

  afterAll(async () => {
    if (insertedId) {
      await pool.query('DELETE FROM users WHERE id = ?', [insertedId]);
    }
    if (pool) {
      await pool.end();
    }
  });
});