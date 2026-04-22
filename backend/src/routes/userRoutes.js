const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getProfile, 
  updateProfile,
  forgotPassword,
  verifyResetToken,
  resetPassword
} = require('../controllers/userController');

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/verify-reset-token/:token', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

// Routes protégées
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;