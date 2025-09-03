const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
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
          // prefer case-insensitive search via filter when available
          const user = await model.findFirst
            ? await model.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })
            : await model.findUnique({ where: { email } })
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

// New helper: check if a user has a given role (case-insensitive)
async function userHasRole(userId, roleName) {
  const pool = getPool();
  if (pool) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM `UserRole` ur JOIN `Role` r ON ur.roleId = r.id WHERE ur.userId = ? AND LOWER(r.name) = LOWER(?) LIMIT 1',
      [userId, roleName]
    );
    return Array.isArray(rows) && rows.length > 0;
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      const rows = await prisma.$queryRaw`
        SELECT 1 FROM UserRole ur JOIN Role r ON ur.roleId = r.id
        WHERE ur.userId = ${userId} AND LOWER(r.name) = LOWER(${roleName}) LIMIT 1
      `;
      return Array.isArray(rows) && rows.length > 0;
    } catch (err) {
      console.error('userHasRole (prisma) error:', err && err.message ? err.message : err);
      return false;
    }
  }

  return false;
}

exports.login = async (req, res) => {
  try {
    console.debug('Login request body:', req.body);

    const { email, password, role /* optional: role name to validate */ } = req.body || {}
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required' })

    const user = await getUserByEmail(email)
    console.debug('User lookup result:', user ? { email: user.email, id: user.id ?? user.ID } : null)

    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' })

    const stored = user.password ?? user.pass ?? user.password_hash ?? ''
    console.debug('Stored password hash (truncated):', stored ? `${stored.slice(0,8)}...` : '(empty)')

    let match = false
    if (stored) {
      try {
        match = await bcrypt.compare(password, stored)
        console.debug('bcrypt.compare result:', match)
      } catch (err) {
        console.debug('bcrypt.compare error:', err && err.message ? err.message : err)
        match = false
      }
      if (!match && stored === password) {
        console.warn('Plain-text password matched stored value — consider re-hashing stored passwords')
        match = true
      }
    }

    if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials' })

    // If caller requested a role validation, enforce it
    if (role) {
      const okRole = await userHasRole(user.id ?? user.ID ?? user.email, role)
      if (!okRole) {
        return res.status(403).json({ ok: false, error: `User does not have required role "${role}"` })
      }
    }

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

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required' });

    const hashed = await bcrypt.hash(password, 10);

    const pool = getPool();
    if (pool) {
      const id = crypto.randomUUID();
      // insert or update via ON DUPLICATE KEY UPDATE (email should have unique index)
      const sql = `
        INSERT INTO usersignup (id, firstName, lastName, email, password, createdAt)
        VALUES (?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE firstName=VALUES(firstName), lastName=VALUES(lastName), password=VALUES(password)
      `;
      await pool.execute(sql, [id, firstName || null, lastName || null, email, hashed]);

      const [rows] = await pool.execute('SELECT * FROM usersignup WHERE LOWER(email)=LOWER(?) LIMIT 1', [email]);
      const user = Array.isArray(rows) && rows.length ? rows[0] : null;
      return res.status(201).json({ ok: true, user: user ? { id: user.id, email: user.email } : null });
    }

    const prisma = getPrisma();
    if (!prisma) throw new Error('No database connection available');

    const user = await prisma.usersignup.upsert({
      where: { email },
      update: { firstName: firstName || null, lastName: lastName || null, password: hashed },
      create: { id: crypto.randomUUID(), firstName: firstName || null, lastName: lastName || null, email, password: hashed },
    });

    return res.status(201).json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error('Create user error:', err && err.message ? err.message : err);
    return res.status(500).json({ ok: false, error: err.message ?? 'Create failed' });
  }
};
