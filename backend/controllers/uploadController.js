const fs = require('fs')
const path = require('path')

const SUBMISSIONS_FILE = path.join(__dirname, '..', 'data', 'submissions.json')
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')

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

// Ensure upload dir exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

exports.submitForm = async (req, res) => {
  try {
    // files handled by multer
    const files = (req.files || []).map(f => ({ originalName: f.originalname || f.originalName, filename: f.filename || f.filename, path: f.path || f.path, size: f.size || f.size }))

    // fields from form
    const fields = req.body || {}

    // Uploads are attach-only: require a submissionId to attach files to an existing submission.
    // This keeps upload separate from normal form submissions (which create FormSubmission records).
    if (!fields.submissionId) {
      return res.status(400).json({ error: 'submissionId is required for file uploads. Create a submission via /api/form/submit first.' })
    }

    // Prisma path: attach files to an existing FormSubmission
    if (prisma) {
      try {
        // If confirmEmail provided, ensure it matches email (optional sanity check)
        if (fields.confirmEmail && fields.email && fields.confirmEmail !== fields.email) {
          return res.status(400).json({ error: 'confirmEmail does not match email' })
        }

        // Attach files to existing submission
        const existing = await prisma.formSubmission.findUnique({ where: { id: fields.submissionId } })
        if (!existing) return res.status(404).json({ error: 'Submission not found' })

        if (files.length === 0) return res.status(400).json({ error: 'No files to attach' })

        const createData = files.map(f => ({
          originalName: f.originalName || f.originalname,
          filename: f.filename,
          path: f.path,
          size: f.size,
          submissionId: fields.submissionId
        }))

        // createMany is faster but doesn't return created rows; we'll createMany then fetch
        await prisma.submissionFile.createMany({ data: createData })

        const updated = await prisma.formSubmission.findUnique({ where: { id: fields.submissionId }, include: { files: true } })
        return res.json({ success: true, submission: updated })
      } catch (err) {
        console.error('Prisma error creating submission with files', err)
        return res.status(500).json({ error: 'Server error' })
      }
    }
    // Fallback (file store): attach files to existing submission record in JSON store
    const submissions = readSubmissions()
    const existingIdx = submissions.findIndex(s => s.id === fields.submissionId)
    if (existingIdx === -1) return res.status(404).json({ error: 'Submission not found (file store)' })

    if (files.length === 0) return res.status(400).json({ error: 'No files to attach' })

    // append files
    submissions[existingIdx].files = submissions[existingIdx].files || []
    submissions[existingIdx].files.push(...files)
    writeSubmissions(submissions)

    res.json({ success: true, submission: submissions[existingIdx] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to submit form' })
  }
}
