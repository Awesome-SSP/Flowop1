const mysql = require('mysql2/promise')

let pool = null
let prisma = null

// Initialize MySQL connection pool
function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not found, database features disabled')
    return
  }

  try {
    // Create MySQL pool using connection string
    pool = mysql.createPool(process.env.DATABASE_URL)
    console.log('MySQL connection pool created')
  } catch (error) {
    console.error('Failed to create MySQL pool:', error.message)
  }

  // Initialize Prisma client if available
  try {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient()
    console.log('Prisma client initialized')
  } catch (error) {
    console.warn('Prisma client not available:', error.message)
  }
}

// Get MySQL pool
function getPool() {
  if (!pool) {
    initializeDatabase()
  }
  return pool
}

// Get Prisma client
function getPrisma() {
  if (!prisma) {
    initializeDatabase()
  }
  return prisma
}

// Test database connection
async function testConnection() {
  try {
    if (pool) {
      const connection = await pool.getConnection()
      await connection.ping()
      connection.release()
      console.log('Database connection successful')
      return true
    }
    return false
  } catch (error) {
    console.error('Database connection failed:', error.message)
    return false
  }
}

// Graceful shutdown
async function closeDatabase() {
  try {
    if (pool) {
      await pool.end()
      console.log('MySQL pool closed')
    }
    if (prisma) {
      await prisma.$disconnect()
      console.log('Prisma client disconnected')
    }
  } catch (error) {
    console.error('Error closing database connections:', error.message)
  }
}

// Initialize on module load
initializeDatabase()

module.exports = {
  getPool,
  getPrisma,
  testConnection,
  closeDatabase,
  initializeDatabase
}