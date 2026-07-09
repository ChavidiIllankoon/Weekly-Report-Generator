const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, authorize('manager'), getAllUsers);

module.exports = router;
