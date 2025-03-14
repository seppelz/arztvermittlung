const express = require('express');
const bulletinController = require('../controllers/bulletin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Öffentliche Routen
router.get('/', bulletinController.getAllBulletins);
router.get('/:id', bulletinController.getBulletin);
router.post('/', bulletinController.createBulletin);

// Admin-Routen
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictToAdmin);

router.patch('/:id', bulletinController.updateBulletin);
router.delete('/:id', bulletinController.deleteBulletin);
router.patch('/:id/status', bulletinController.updateBulletinStatus);

module.exports = router; 