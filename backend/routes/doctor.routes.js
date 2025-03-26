const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const doctorController = require('../controllers/doctor.controller');

// Get doctor profile
router.get('/profile', authMiddleware.protect, doctorController.getProfile);

// Update doctor profile
router.post('/profile', authMiddleware.protect, doctorController.updateProfile);

// Delete doctor profile
router.delete('/profile', authMiddleware.protect, doctorController.deleteProfile);

module.exports = router; 