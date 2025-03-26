const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const doctorController = require('../controllers/doctor.controller');

// Get doctor profile
router.get('/profile', auth, doctorController.getProfile);

// Update doctor profile
router.post('/profile', auth, doctorController.updateProfile);

// Delete doctor profile
router.delete('/profile', auth, doctorController.deleteProfile);

module.exports = router; 