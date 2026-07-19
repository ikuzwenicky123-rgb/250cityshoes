const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Temporary in-memory user storage (will be replaced with database)
const users = [
  {
    id: 1,
    name: 'Test Customer',
    email: 'customer@test.com',
    phone: '+250788888888',
    password: '$2a$10$YourHashedPasswordHere', // demo
    region: 'Kigali',
    gender: 'male',
    role: 'customer',
    createdAt: new Date(),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, region, gender } = req.body;

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      phone,
      password: hashedPassword,
      region,
      gender,
      role: 'customer',
      createdAt: new Date(),
      isDeleted: false,
      deletedAt: null,
    };

    users.push(newUser);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        region: newUser.region,
        gender: newUser.gender,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = users.find(u => u.email === email || u.phone === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is deleted
    if (user.isDeleted) {
      const deletedDate = new Date(user.deletedAt);
      const daysSinceDelete = Math.floor((new Date() - deletedDate) / (1000 * 60 * 60 * 24));
      if (daysSinceDelete < 14) {
        return res.status(403).json({
          message: `Account is deleted. You can restore it within ${14 - daysSinceDelete} days.`,
          canRestore: true,
        });
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        region: user.region,
        gender: user.gender,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // In JWT, logout is handled on client side by removing token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;