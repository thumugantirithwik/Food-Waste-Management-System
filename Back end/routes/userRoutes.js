const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  verifyUser,
  suspendUser,
  changePassword,
} = require('../controllers/userController');
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Support /api/users/login and /api/users/register for direct frontend compatibility
router.post('/login', login);
router.post('/register', register);

// Change password route (must be before /:id to avoid conflicts)
router.put('/change-password', protect, changePassword);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/verify', protect, authorize('admin'), verifyUser);
router.put('/:id/suspend', protect, authorize('admin'), suspendUser);

// General user routes
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);

module.exports = router;
