const express = require('express');
const router = express.Router();

// Register
router.post('/register', (req, res) => {
  // TODO: Hash password, save to database
  res.json({ message: 'User registered' });
});

// Login
router.post('/login', (req, res) => {
  // TODO: Verify credentials, generate JWT
  res.json({ token: 'jwt_token_here' });
});

// Logout
router.post('/logout', (req, res) => {
  // TODO: Invalidate token
  res.json({ message: 'User logged out' });
});

module.exports = router;