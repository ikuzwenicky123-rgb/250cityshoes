const express = require('express');
const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  // TODO: Fetch from database
  res.json([]);
});

// Get product by ID
router.get('/:id', (req, res) => {
  // TODO: Fetch from database
  res.json({});
});

// Create product (Admin)
router.post('/', (req, res) => {
  // TODO: Validate and save to database
  res.json({ message: 'Product created' });
});

// Update product (Admin)
router.put('/:id', (req, res) => {
  // TODO: Update in database
  res.json({ message: 'Product updated' });
});

// Delete product (Admin)
router.delete('/:id', (req, res) => {
  // TODO: Delete from database
  res.json({ message: 'Product deleted' });
});

module.exports = router;