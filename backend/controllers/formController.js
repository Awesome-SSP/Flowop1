const fs = require('fs')
const path = require('path')

const SUBMISSIONS_FILE = path.join(__dirname, '..', 'data', 'submissions.json')

// Prisma client (optional)
let prisma = null
if (process.env.DATABASE_URL) {
  try {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient()
  } catch (err) {
    console.warn('Prisma client not installed or generated; falling back to file store')
  }
}

function readSubmissions() {
  try {
    const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

function writeSubmissions(submissions) {
  fs.mkdirSync(path.dirname(SUBMISSIONS_FILE), { recursive: true })
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf8')
}

exports.submit = async (req, res) => {
  try {
    const fields = req.body || {}

    // Basic validation: ensure at least one field is present
    if (!fields || Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'Form data required' })
    }

    // Map incoming fields to schema fields
    const mapped = {
      type: fields.type || null,
      existingContacts: fields.existingContacts || null,
      firstName: fields.firstName || null,
      lastName: fields.lastName || null,
      email: fields.email || (fields.Email || null),
      confirmEmail: fields.confirmEmail || null,
      phoneNo: fields.phoneNo || null,
      role: fields.role || null,
      userGroup: fields.userGroup || 'None Selected'
    }

    // Prisma path
    if (prisma) {
      try {
        const created = await prisma.formSubmission.create({
          data: {
            type: mapped.type,
            existingContacts: mapped.existingContacts,
            firstName: mapped.firstName,
            lastName: mapped.lastName,
            email: mapped.email || '',
            confirmEmail: mapped.confirmEmail,
            phoneNo: mapped.phoneNo,
            role: mapped.role,
            userGroup: mapped.userGroup
          }
        })
        return res.json({ success: true, submission: created })
      } catch (err) {
        console.error('Prisma error creating form submission', err)
        return res.status(500).json({ error: 'Server error' })
      }
    }

    const submissions = readSubmissions()
    const submission = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      fields: mapped,
      files: []
    }

    submissions.push(submission)
    writeSubmissions(submissions)

    res.json({ success: true, submission })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit form' })
  }
}
