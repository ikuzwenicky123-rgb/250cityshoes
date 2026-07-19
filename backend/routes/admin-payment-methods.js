const express = require('express');
const router = express.Router();

// Get all payment methods (Admin)
router.get('/', (req, res) => {
  // TODO: Verify admin authentication, fetch from database
  const paymentMethods = [
    {
      id: 1,
      name: 'MTN Mobile Money',
      description: 'Pay using MTN MoMo service',
      accountNumber: '0785634773',
      isActive: true,
      type: 'mobile_money',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Airtel Money',
      description: 'Pay using Airtel Money service',
      accountNumber: '+250788123456',
      isActive: true,
      type: 'mobile_money',
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      accountNumber: 'BK: 1234567890',
      isActive: true,
      type: 'bank_transfer',
      createdAt: new Date(),
    },
  ];
  res.json(paymentMethods);
});

// Create new payment method (Admin)
router.post('/', (req, res) => {
  const { name, description, accountNumber, type } = req.body;
  
  if (!name || !accountNumber || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // TODO: Save to database
  const newPaymentMethod = {
    id: Date.now(),
    name,
    description,
    accountNumber,
    type,
    isActive: true,
    createdAt: new Date(),
  };

  res.status(201).json({
    message: 'Payment method created successfully',
    data: newPaymentMethod,
  });
});

// Update payment method (Admin)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, accountNumber, type, isActive } = req.body;

  // TODO: Update in database
  const updatedPaymentMethod = {
    id,
    name,
    description,
    accountNumber,
    type,
    isActive,
    updatedAt: new Date(),
  };

  res.json({
    message: 'Payment method updated successfully',
    data: updatedPaymentMethod,
  });
});

// Delete payment method (Admin)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // TODO: Delete from database
  res.json({
    message: 'Payment method deleted successfully',
    id,
  });
});

// Toggle payment method active/inactive (Admin)
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  // TODO: Update in database
  res.json({
    message: 'Payment method status updated',
    id,
    isActive,
  });
});

module.exports = router;