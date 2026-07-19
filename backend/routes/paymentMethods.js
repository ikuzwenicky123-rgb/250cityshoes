const express = require('express');
const router = express.Router();

// Get all payment methods
router.get('/', (req, res) => {
  // TODO: Fetch from database
  const paymentMethods = [
    {
      id: 1,
      name: 'MTN Mobile Money',
      description: 'Pay using MTN MoMo service',
      accountNumber: '0785634773',
      isActive: true,
      type: 'mobile_money',
    },
    {
      id: 2,
      name: 'Airtel Money',
      description: 'Pay using Airtel Money service',
      accountNumber: '+250788123456',
      isActive: true,
      type: 'mobile_money',
    },
    {
      id: 3,
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      accountNumber: 'BK: 1234567890 (Bank of Rwanda)',
      isActive: true,
      type: 'bank_transfer',
    },
  ];
  res.json(paymentMethods);
});

module.exports = router;