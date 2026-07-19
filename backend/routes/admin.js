const express = require('express');
const router = express.Router();

// Get dashboard stats
router.get('/stats', (req, res) => {
  // TODO: Calculate from database
  res.json({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
});

// Get all guest admins
router.get('/guest-admins', (req, res) => {
  // TODO: Fetch from database
  res.json([]);
});

// Create guest admin
router.post('/guest-admins', (req, res) => {
  // TODO: Save to database
  res.json({ message: 'Guest admin created' });
});

// Delete guest admin
router.delete('/guest-admins/:id', (req, res) => {
  // TODO: Delete from database
  res.json({ message: 'Guest admin deleted' });
});

// Update website settings
router.put('/settings', (req, res) => {
  // TODO: Update in database
  res.json({ message: 'Settings updated' });
});

module.exports = router;