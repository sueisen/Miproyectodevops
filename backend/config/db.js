require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

function isDatabaseConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

function getConnectionConfig() {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  };
}

async function ensureDatabaseExists() {
  const dbName = process.env.DB_NAME || 'myproyectodevops';
  const connection = await mysql.createConnection(getConnectionConfig());
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await connection.end();
}

function createPool() {
  return mysql.createPool({
    ...getConnectionConfig(),
    database: process.env.DB_NAME || 'myproyectodevops',
    waitForConnections: true,
    connectionLimit: 5,
  });
}

module.exports = { createPool, isDatabaseConfigured, ensureDatabaseExists };
