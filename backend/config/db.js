require('dotenv').config();
const mysql = require('mysql2/promise');

function isDatabaseConfigured() {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'myproyectodevops',
    waitForConnections: true,
    connectionLimit: 5,
  });
}

module.exports = { createPool, isDatabaseConfigured };
