// load environment variables immediately so controllers see DATABASE_URL
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const uploadRoutes = require('./routes/upload')
const formRoutes = require('./routes/form')


// import shared DB helpers from config
const db = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Basic route
app.get('/', (req, res) => {
  res.send('Backend server is running!')
})

// Auth routes
app.use('/api/login', authRoutes)

// Upload / form submission routes
app.use('/api/upload', uploadRoutes)
app.use('/api/form', formRoutes)

// simple health endpoint that checks DB connectivity
app.get('/health', async (req, res) => {
  try {
    const status = await authController.checkDbConnection()
    if (status.ok) return res.json({ ok: true, db: 'ok' })
    return res.status(503).json({ ok: false, db: 'down', error: status.error })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) })
  }
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)

  // initialize DB connection from config (if available)
  try {
    if (typeof db.initializeDatabase === 'function') {
      await db.initializeDatabase()
      console.log('Database initialized via config/db.initializeDatabase()')
    } else if (typeof db.getPool === 'function') {
      // warm up pool
      await db.getPool()
      console.log('Database pool ready via config/db.getPool()')
    } else if (typeof db.getPrisma === 'function') {
      await db.getPrisma()
      console.log('Prisma client ready via config/db.getPrisma()')
    } else {
      console.warn('No DB initializer found in config/db — continuing')
    }

    
    
  } catch (err) {
    console.error('Database initialization/check error:', err && err.message ? err.message : err)
  }
})