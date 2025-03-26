const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const hospitalController = require('../controllers/hospital.controller');

// Get hospital profile
router.get('/profile', auth, hospitalController.getProfile);

// Update hospital profile
router.post('/profile', auth, hospitalController.updateProfile);

module.exports = router; 