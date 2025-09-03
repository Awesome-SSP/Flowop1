const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const uploadController = require('../controllers/uploadController')

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
    cb(null, safe)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB per file, max 5 files
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype || ''
    const ok = mime.startsWith('image/') ||
      mime === 'application/pdf' ||
      mime === 'text/csv' ||
      mime === 'application/csv' ||
      mime === 'application/vnd.ms-excel'
    if (ok) cb(null, true)
    else cb(new Error('Invalid file type. Allowed: images, PDF, CSV'), false)
  }
})

// Accept multiple files in field 'files' and normal form fields
router.post('/submit', upload.array('files'), uploadController.submitForm)

module.exports = router
