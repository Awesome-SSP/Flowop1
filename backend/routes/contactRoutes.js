// filepath: c:\Users\GAURAV\Desktop\FlowOps\backend\routes\contactRoutes.js
const express = require('express');
const router = express.Router();
const { registerContact } = require('../controllers/contactController');

router.post('/register', registerContact);

module.exports = router;