const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const hospitalController = require('../controllers/hospital.controller');

// Get hospital profile
router.get('/profile', authMiddleware.protect, hospitalController.getProfile);

// Update hospital profile
router.post('/profile', authMiddleware.protect, hospitalController.updateProfile);

// Delete hospital profile
router.delete('/profile', authMiddleware.protect, hospitalController.deleteProfile);

module.exports = router; 