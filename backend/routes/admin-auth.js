const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Temporary admin storage
const admins = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@cityshoes.store',
    password: '$2a$10$0NK1JR5XvL7g3JM5X5X5XuZ7H3Z5X7X5X5X5X5X5X5X5X5X5X5X5', // Change this
    role: 'admin',
    canManageGuests: true,
    createdAt: new Date(),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = admins.find(a => a.email === email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // For demo, accept password "admin123"
    if (password !== 'admin123' && password !== admin.password) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        canManageGuests: admin.canManageGuests,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;