// load environment variables immediately so controllers see DATABASE_URL
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const authController = require('./controllers/authController') // <-- add this
const uploadRoutes = require('./routes/upload')
const formRoutes = require('./routes/form')
const db = require('./config/db')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Basic route
app.get('/', (req, res) => res.send('Backend server is running!'))

// NEW: separate login endpoint (uses same controller)
app.post('/api/login', authController.login)

// keep role/validate endpoints under /api/auth
app.use('/api/auth', authRoutes)

// Upload / form submission routes
app.use('/api/upload', uploadRoutes)
app.use('/api/form', formRoutes)

// health endpoint that uses the shared DB helper (testConnection) rather than creating a new connection here
app.get('/health', async (req, res) => {
  try {
    const ok = await db.testConnection()
    if (ok) return res.json({ ok: true, db: 'ok' })
    return res.status(503).json({ ok: false, db: 'down' })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err && err.message ? err.message : String(err) })
  }
})

// Start server
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`)

  // Optional warm-up: initializeDatabase attempts to create/verify pool & prisma
  // This is not required (getPool/getPrisma will lazily return the shared instances),
  // but warming up at startup fails fast if DB is unreachable.
  try {
    if (typeof db.initializeDatabase === 'function') {
      await db.initializeDatabase()
      console.log('Database initialized via config/db.initializeDatabase()')
    } else {
      console.log('No explicit DB initializer found; DB will be initialized lazily on first use.')
    }
  } catch (err) {
    console.error('Database initialization/check error:', err && err.message ? err.message : err)
  }
})