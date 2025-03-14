const express = require('express');
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Öffentliche Route zum Erstellen von Kontaktanfragen
router.post('/', contactController.createContact);

// Admin-Routen
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictToAdmin);

router.get('/', contactController.getAllContacts);
router.get('/:id', contactController.getContact);
router.patch('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

module.exports = router;