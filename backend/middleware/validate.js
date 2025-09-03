const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(req, res, next) {
  const body = req.body || {}

  // Require at least one meaningful field
  const keys = Object.keys(body).filter(k => body[k] !== undefined && body[k] !== null && String(body[k]).trim() !== '')
  if (keys.length === 0) return res.status(400).json({ error: 'Form must include at least one field' })

  // If email present, validate format
  if (body.email) {
    if (typeof body.email !== 'string' || !EMAIL_RE.test(body.email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    if (body.email.length > 320) return res.status(400).json({ error: 'Email too long' })
  }

  // Optional length limits for common fields
  if (body.name && String(body.name).length > 200) return res.status(400).json({ error: 'Name too long' })
  if (body.message && String(body.message).length > 2000) return res.status(400).json({ error: 'Message too long' })

  next()
}

module.exports = { validateForm }
