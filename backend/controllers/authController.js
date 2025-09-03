const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getPool, getPrisma, testConnection } = require('../config/db')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

async function getUserByEmail(email) {
  const pool = getPool()
  if (pool) {
    const [rows] = await pool.execute('SELECT * FROM usersignup WHERE LOWER(email) = LOWER(?) LIMIT 1', [email])
    return Array.isArray(rows) && rows.length ? rows[0] : null
  }

  const prisma = getPrisma()
  if (prisma) {
    // try common model access, else raw query
    const candidates = ['usersignup', 'userSignup', 'UserSignup', 'user', 'User']
    for (const name of candidates) {
      const model = prisma[name]
      if (model && typeof model.findUnique === 'function') {
        try {
          const user = await model.findUnique({ where: { email } })
          if (user) return user
        } catch {
          // ignore and continue
        }
      }
    }
    try {
      const rows = await prisma.$queryRaw`SELECT * FROM usersignup WHERE LOWER(email) = LOWER(${email}) LIMIT 1`
      if (Array.isArray(rows) && rows.length) return rows[0]
    } catch {
      // ignore
    }
  }

  throw new Error('No database connection available')
}

exports.login = async (req, res) => {
  try {
    console.debug('Login request body:', req.body); // <-- add this line

    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required' })

    const user = await getUserByEmail(email)
    console.debug('User lookup result:', user ? { email: user.email, id: user.id ?? user.ID } : null) // <-- add this line

    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' })

    const stored = user.password ?? user.pass ?? user.password_hash ?? ''
    let match = false
    if (stored) {
      try {
        match = await bcrypt.compare(password, stored)
      } catch {
        match = false
      }
      if (!match && stored === password) match = true
    }

    if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user.id ?? user.ID ?? user.email, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      ok: true,
      token,
      user: {
        id: user.id ?? user.ID ?? null,
        email: user.email,
        firstName: user.firstName ?? user.first_name ?? null,
        lastName: user.lastName ?? user.last_name ?? null,
      },
    })
  } catch (err) {
    console.error('Login error:', err && err.message ? err.message : err)
    return res.status(500).json({ ok: false, error: err.message ?? 'Authentication failed' })
  }
}

exports.checkDbConnection = async () => {
  try {
    const ok = await testConnection()
    return { ok }
  } catch (err) {
    return { ok: false, error: err.message ?? String(err) }
  }
}
