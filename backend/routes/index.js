const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bulletinRoutes = require('./bulletin.routes');
const contactRoutes = require('./contact.routes');
const hospitalRoutes = require('./hospital.routes');

// Mount all routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/bulletin', bulletinRoutes);
router.use('/contact', contactRoutes);
router.use('/hospital', hospitalRoutes);

module.exports = router; 