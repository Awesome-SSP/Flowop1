const mysql = require('mysql2/promise');
require('dotenv').config();
let pool = null;
let prisma = null;
let _initialized = false;

async function initializeDatabase() {
  if (_initialized) return;
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, database features disabled');
    return;
  }

  try {
    // create pool from connection string (mysql2 supports URI)
    pool = mysql.createPool(process.env.DATABASE_URL);
    // quick verification
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('MySQL connection pool created and verified');
  } catch (error) {
    console.error('Failed to create/verify MySQL pool:', error.message);
    pool = null;
  }

  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Prisma client connected');
  } catch (error) {
    console.warn('Prisma client not available or failed to connect:', error.message);
    prisma = null;
  }

  _initialized = true;
}

// getters ensure initialization attempted
function getPool() {
  if (!_initialized) initializeDatabase().catch((e) => console.error(e));
  return pool;
}

function getPrisma() {
  if (!_initialized) initializeDatabase().catch((e) => console.error(e));
  return prisma;
}

async function testConnection() {
  try {
    if (pool) {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      return true;
    }
    if (prisma) {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
}

async function closeDatabase() {
  try {
    if (pool) {
      await pool.end();
      console.log('MySQL pool closed');
      pool = null;
    }
    if (prisma) {
      await prisma.$disconnect();
      console.log('Prisma client disconnected');
      prisma = null;
    }
    _initialized = false;
  } catch (error) {
    console.error('Error closing database connections:', error.message);
  }
}

// start initialization in background (non-blocking)
initializeDatabase().catch((err) => {
  console.error('initializeDatabase error:', err && err.message ? err.message : err);
});

module.exports = {
  getPool,
  getPrisma,
  testConnection,
  closeDatabase,
  initializeDatabase,
};