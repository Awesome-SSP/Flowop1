const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');
const { getPool, getPrisma } = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// login
router.post('/', authController.login);

// GET /api/auth/roles  -> returns roles for authenticated user
router.get('/roles', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ ok: false, error: 'Missing token' });

  let userId;
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    userId = payload.id;
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }

  const pool = getPool();
  if (pool) {
    try {
      const [rows] = await pool.execute(
        'SELECT r.id, r.name, r.description FROM `UserRole` ur JOIN `Role` r ON ur.roleId = r.id WHERE ur.userId = ?',
        [userId]
      );
      return res.json(rows || []);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      const rows = await prisma.$queryRaw`
        SELECT r.id, r.name, r.description FROM UserRole ur JOIN Role r ON ur.roleId = r.id WHERE ur.userId = ${userId}
      `;
      return res.json(rows || []);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(500).json({ ok: false, error: 'No DB connection' });
});

// POST /api/auth/validate-role  -> { role: "RoleName" } returns { ok:true, hasRole: boolean }
router.post('/validate-role', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ ok: false, error: 'Missing token' });

  let userId;
  try {
    const token = auth.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    userId = payload.id;
  } catch (err) {
    return res.status(401).json({ ok: false, error: 'Invalid token' });
  }

  const { role } = req.body;
  if (!role) return res.status(400).json({ ok: false, error: 'Role name required' });

  const pool = getPool();
  if (pool) {
    try {
      const [rows] = await pool.execute(
        'SELECT 1 FROM `UserRole` ur JOIN `Role` r ON ur.roleId = r.id WHERE ur.userId = ? AND LOWER(r.name) = LOWER(?) LIMIT 1',
        [userId, role]
      );
      return res.json({ ok: true, hasRole: Array.isArray(rows) && rows.length > 0 });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      const rows = await prisma.$queryRaw`
        SELECT 1 FROM UserRole ur JOIN Role r ON ur.roleId = r.id
        WHERE ur.userId = ${userId} AND LOWER(r.name) = LOWER(${role}) LIMIT 1
      `;
      return res.json({ ok: true, hasRole: Array.isArray(rows) && rows.length > 0 });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  return res.status(500).json({ ok: false, error: 'No DB connection' });
});

module.exports = router;
