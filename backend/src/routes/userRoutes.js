const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/userController');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;