// Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');




router.post('/signup', authController.signup);



router.post('/login', authController.login);

// Protected Routes (JWT token required)

router.get('/dashboard', authMiddleware, authController.getDashboard);

// Update user profile
router.put('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
