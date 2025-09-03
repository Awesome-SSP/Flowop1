const express = require('express')
const router = express.Router()
const formController = require('../controllers/formController')
const { validateForm } = require('../middleware/validate')

// POST /submit expects application/json body
router.post('/submit', validateForm, formController.submit)

module.exports = router
