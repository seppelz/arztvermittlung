const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Alle Routen sind nur für Admins zugänglich
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictToAdmin);

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router; 